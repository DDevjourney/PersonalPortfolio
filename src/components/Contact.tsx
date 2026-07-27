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

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (status !== 'sending') {
      setStatus('idle')
      setMessage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return

    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      setStatus('error')
      setMessage('Por favor, completa todos los campos.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error')
      setMessage('Introduce un email válido.')
      return
    }
    if (!isConfigured) {
      setStatus('error')
      setMessage('El envío no está configurado. Escríbeme a carlosdsp2308@gmail.com.')
      return
    }

    setStatus('sending')
    setMessage(null)

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
              />
            </div>

            {/* Estado del envío: role="status" para que los lectores de
                pantalla lo anuncien sin interrumpir lo que estén leyendo. */}
            <p
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
