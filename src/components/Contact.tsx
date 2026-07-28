import { useRef, useState } from 'react'
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

  // El foco no puede quedarse en el cambio de color de un borde de 1px: es
  // demasiado sutil para WCAG 2.4.11, así que el indicador es un anillo.
  // `focus-visible` (y no `focus`) para que salga al tabular pero no al hacer
  // click con el ratón.
  // Aquí había un `focus:border-ink` que era código muerto: comprobado en el
  // navegador, nunca llegaba a aplicarse porque `border-ink/20` le gana la
  // cascada (Tailwind emite la variante con opacidad después). Así que el
  // único indicador de foco que quedaba era el del navegador... y
  // `focus:outline-none` lo estaba quitando. De ahí el anillo.
  const inputClass =
    'w-full rounded-sm border-b border-ink/20 bg-transparent py-3 text-base text-ink placeholder:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper transition-colors duration-300 disabled:opacity-50'

  const sending = status === 'sending'

  /** Marca el campo como inválido y lo apunta al mensaje de estado. */
  const a11y = (field: keyof FormState) =>
    invalid[field] ? { 'aria-invalid': true, 'aria-describedby': ESTADO_ID } : {}

  return (
    <section id="contacto" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="006" title="Contacto" />

        <form onSubmit={handleSubmit} noValidate className="mt-12 max-w-2xl">
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

          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-xs uppercase tracking-wider text-ink-soft">
                  Nombre
                </label>
                <input
                  ref={(el) => { fieldRefs.current.nombre = el }}
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  value={form.nombre}
                  onChange={update('nombre')}
                  disabled={sending}
                  placeholder="Tu nombre"
                  className={inputClass}
                  {...a11y('nombre')}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs uppercase tracking-wider text-ink-soft">
                  Email
                </label>
                <input
                  ref={(el) => { fieldRefs.current.email = el }}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  disabled={sending}
                  placeholder="tu@email.com"
                  className={inputClass}
                  {...a11y('email')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mensaje" className="text-xs uppercase tracking-wider text-ink-soft">
                Mensaje
              </label>
              <textarea
                ref={(el) => { fieldRefs.current.mensaje = el }}
                id="mensaje"
                name="mensaje"
                rows={4}
                value={form.mensaje}
                onChange={update('mensaje')}
                disabled={sending}
                placeholder="Cuéntame sobre tu proyecto..."
                className={`${inputClass} resize-none`}
                {...a11y('mensaje')}
              />
            </div>

            {/* Estado del envío: role="status" para que los lectores de
                pantalla lo anuncien sin interrumpir lo que estén leyendo. */}
            <p
              id={ESTADO_ID}
              role="status"
              aria-live="polite"
              className={`text-sm ${status === 'error' ? 'text-red-700' : 'text-ink'}`}
            >
              {message}
            </p>

            <button
              type="submit"
              disabled={sending}
              className="pill self-start disabled:opacity-50"
            >
              {sending ? 'Enviando…' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
