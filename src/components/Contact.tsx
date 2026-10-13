import { useLayoutEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import SectionHeading from './SectionHeading'

interface FormState {
  nombre: string
  email: string
  mensaje: string
}

const EMPTY_FORM: FormState = { nombre: '', email: '', mensaje: '' }

/** Credenciales de EmailJS. Se definen en `.env.local` (ver `.env.example`). */
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

const isConfigured = Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey)

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** id de la región de estado, referenciada por aria-describedby. */
const ESTADO_ID = 'contacto-estado'

interface FieldProps {
  id: keyof FormState
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  disabled: boolean
  invalid: boolean
  fieldRef: (el: HTMLInputElement | HTMLTextAreaElement | null) => void
  type?: string
  autoComplete?: string
  multiline?: boolean
}

/**
 * Campo sin aspecto de campo: no hay caja, solo la palabra en grande (hace
 * de placeholder) y una barra roja debajo. Al escribir, la palabra deja paso al
 * texto en mono. Como el placeholder desaparece, mientras el campo tiene el
 * foco la barra crece y muestra su nombre; eso hace además de indicador de
 * foco. La etiqueta real va oculta para lectores de pantalla, que no siempre
 * anuncian bien un placeholder.
 */
function Field({ id, label, value, onChange, disabled, invalid, fieldRef, type = 'text', autoComplete, multiline }: FieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // El mensaje crece hacia abajo con el texto en vez de tener un alto fijo.
  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const fieldClass =
    'relative block min-h-[2.75rem] w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-mono text-lg text-ink caret-accent outline-none disabled:opacity-50'
  const common = {
    id,
    name: id,
    value,
    onChange,
    disabled,
    autoComplete,
    ...(invalid ? { 'aria-invalid': true, 'aria-describedby': ESTADO_ID } : {}),
  }

  return (
    <div className="group relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {/* La palabra grande hace de placeholder y se desvanece en cuanto el
          campo recibe el foco (su nombre pasa a la barra). No es el
          `placeholder` nativo porque, al ser mucho más grande que el texto
          del campo, el navegador la recortaba y la colocaba distinta en input
          y textarea. */}
      {!value && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 flex h-[2.75rem] items-center font-display text-3xl uppercase leading-none tracking-[0.03em] text-ink transition-opacity duration-300 group-focus-within:opacity-0 md:text-4xl"
        >
          {label}
        </span>
      )}
      {multiline ? (
        <textarea
          {...common}
          ref={(el) => {
            textareaRef.current = el
            fieldRef(el)
          }}
          rows={1}
          className={`${fieldClass} py-[0.45rem] leading-relaxed`}
        />
      ) : (
        <input
          {...common}
          ref={fieldRef}
          type={type}
          className={`${fieldClass} h-[2.75rem]`}
        />
      )}
      {/* Si el campo falla, la barra pasa a tinta y deja su nombre a la vista. */}
      <div
        aria-hidden
        className={`mt-2 flex h-2.5 items-center overflow-hidden transition-[height] duration-300 ease-expo group-focus-within:h-6 ${
          invalid ? 'h-6 bg-ink' : 'bg-accent'
        }`}
      >
        <span
          className={`px-2 font-mono text-xs font-bold uppercase tracking-wider transition-opacity duration-300 group-focus-within:opacity-100 ${
            invalid ? 'text-paper opacity-100' : 'text-ink opacity-0'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

/**
 * Sección Contacto.
 *  - <form> real: se envía con Enter desde cualquier campo.
 *  - Validación en JS antes de llamar a EmailJS (por eso `noValidate`).
 *  - El envío usa EmailJS, que manda el correo desde el navegador sin backend.
 */
export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)
  /** Campos concretos que fallaron, para marcarlos con aria-invalid. */
  const [invalid, setInvalid] = useState<Partial<Record<keyof FormState, boolean>>>({})

  /** Referencias a los campos, para poder llevar el foco al primero inválido. */
  const fieldRefs = useRef<Partial<Record<keyof FormState, HTMLElement | null>>>({})

  /**
   * Trampa para bots: un campo que ningún humano ve ni puede tabular. Los
   * scripts que rellenan todos los inputs del formulario lo completan y se
   * delatan. No es estado de React porque nunca se pinta a partir de él.
   */
  const honeypotRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setInvalid((prev) => ({ ...prev, [field]: false }))
    if (status !== 'sending') {
      setStatus('idle')
      setMessage(null)
    }
  }

  /** Orden en que se recorren los campos al buscar el primero inválido. */
  const FIELD_ORDER: (keyof FormState)[] = ['nombre', 'email', 'mensaje']

  const fail = (
    msg: string,
    campos: Partial<Record<keyof FormState, boolean>> = {},
  ) => {
    setStatus('error')
    setMessage(msg)
    setInvalid(campos)
    // El role="status" anuncia el error, pero sin mover el foco había que
    // volver a tabular a ciegas para dar con el campo que falla.
    const primero = FIELD_ORDER.find((f) => campos[f])
    if (primero) fieldRefs.current[primero]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return

    // Honeypot relleno: es un bot. Se finge el envío correcto en lugar de dar
    // un error, para no darle pistas de por qué ha fallado.
    if (honeypotRef.current?.value) {
      setStatus('sent')
      setMessage('¡Gracias! He recibido tu mensaje y te responderé pronto.')
      setForm(EMPTY_FORM)
      return
    }

    const vacios = {
      nombre: !form.nombre.trim(),
      email: !form.email.trim(),
      mensaje: !form.mensaje.trim(),
    }
    if (vacios.nombre || vacios.email || vacios.mensaje) {
      fail('Por favor, completa todos los campos.', vacios)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      fail('Introduce un email válido.', { email: true })
      return
    }
    if (!isConfigured) {
      fail('El envío no está configurado. Escríbeme a carlosdsp2308@gmail.com.')
      return
    }

    setStatus('sending')
    setMessage(null)
    setInvalid({})

    try {
      await emailjs.send(
        EMAILJS.serviceId!,
        EMAILJS.templateId!,
        {
          name: form.nombre,
          email: form.email,
          message: form.mensaje,
        },
        { publicKey: EMAILJS.publicKey! },
      )
      setStatus('sent')
      setMessage('¡Gracias! He recibido tu mensaje y te responderé pronto.')
      setForm(EMPTY_FORM)
    } catch (err) {
      console.error('EmailJS:', err)
      setStatus('error')
      setMessage(
        'No he podido enviar el mensaje. Inténtalo de nuevo o escríbeme a carlosdsp2308@gmail.com.',
      )
    }
  }

  const sending = status === 'sending'

  return (
    <section id="contacto" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="005" title="Contacto" />

        <form onSubmit={handleSubmit} noValidate className="mt-12 md:mt-16">
          {/* Honeypot. Fuera de pantalla en lugar de `hidden` o `sr-only`: con
              `hidden` muchos bots lo ignoran (que es justo lo que no queremos)
              y con `sr-only` sigue en el árbol de accesibilidad, así que un
              lector de pantalla lo anunciaría. `aria-hidden` + `tabIndex={-1}`
              lo dejan inalcanzable para cualquier usuario real.
              `autoComplete="off"` evita que el navegador lo rellene solo y
              acabe bloqueando el envío de una persona. */}
          <input
            ref={honeypotRef}
            type="text"
            name="empresa"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-10 md:grid-cols-[1fr_1fr_1.5fr_auto]">
            <Field
              id="nombre"
              label="Nombre"
              autoComplete="name"
              value={form.nombre}
              onChange={update('nombre')}
              disabled={sending}
              invalid={Boolean(invalid.nombre)}
              fieldRef={(el) => { fieldRefs.current.nombre = el }}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              disabled={sending}
              invalid={Boolean(invalid.email)}
              fieldRef={(el) => { fieldRefs.current.email = el }}
            />
            <Field
              id="mensaje"
              label="Mensaje"
              multiline
              value={form.mensaje}
              onChange={update('mensaje')}
              disabled={sending}
              invalid={Boolean(invalid.mensaje)}
              fieldRef={(el) => { fieldRefs.current.mensaje = el }}
            />

            {/* Mismo alto que la línea de los campos para quedar alineado con
                ellos aunque el mensaje crezca hacia abajo. */}
            <button
              type="submit"
              disabled={sending}
              className="flex h-[2.75rem] items-center gap-2 justify-self-end whitespace-nowrap font-display text-3xl uppercase tracking-[0.03em] text-ink transition-opacity duration-300 hover:opacity-70 focus-visible:underline focus-visible:decoration-accent focus-visible:decoration-4 focus-visible:underline-offset-8 focus-visible:outline-none disabled:opacity-50 md:text-4xl"
            >
              {sending ? 'Enviando…' : 'Enviar'}
              {!sending && <span aria-hidden className="text-accent">→</span>}
            </button>
          </div>

          {/* Estado del envío: role="status" para que los lectores de
              pantalla lo anuncien sin interrumpir lo que estén leyendo. */}
          <p
            id={ESTADO_ID}
            role="status"
            aria-live="polite"
            className={`mt-8 font-mono text-sm ${status === 'error' ? 'text-red-700' : 'text-ink'}`}
          >
            {message}
          </p>
        </form>
      </div>
    </section>
  )
}
