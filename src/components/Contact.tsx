import { useState } from 'react'
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

  const fail = (
    msg: string,
    campos: Partial<Record<keyof FormState, boolean>> = {},
  ) => {
    setStatus('error')
    setMessage(msg)
    setInvalid(campos)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return

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

  const inputClass =
    'w-full border-b border-ink/20 bg-transparent py-3 text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors duration-300 disabled:opacity-50'

  const sending = status === 'sending'

  /** Marca el campo como inválido y lo apunta al mensaje de estado. */
  const a11y = (field: keyof FormState) =>
    invalid[field] ? { 'aria-invalid': true, 'aria-describedby': ESTADO_ID } : {}

  return (
    <section id="contacto" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="006" title="Contacto" />

        <form onSubmit={handleSubmit} noValidate className="mt-12 max-w-2xl">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-xs uppercase tracking-wider text-ink-soft">
                  Nombre
                </label>
                <input
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
