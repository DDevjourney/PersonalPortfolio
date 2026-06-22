import { useState } from 'react'
import SectionHeading from './SectionHeading'

interface FormState {
  nombre: string
  email: string
  mensaje: string
}

const EMPTY_FORM: FormState = { nombre: '', email: '', mensaje: '' }

/**
 * Sección Contacto.
 *  - Estado del formulario gestionado con useState.
 *  - No usa <form> con submit nativo: el botón usa onClick + validación JS.
 *  - El envío real de email se conectará más adelante.
 */
export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError(null)
    setSent(false)
  }

  const handleSend = () => {
    // Validación básica en JS
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      setError('Por favor, completa todos los campos.')
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    if (!emailOk) {
      setError('Introduce un email válido.')
      return
    }

    // TODO: conectar aquí el envío real del email.
    console.log('Formulario listo para enviar:', form)
    setSent(true)
    setForm(EMPTY_FORM)
  }

  const inputClass =
    'w-full border-b border-ink/20 bg-transparent py-3 text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors duration-300'

  return (
    <section id="contacto" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="006" title="Contacto" />

        <div className="mt-12 max-w-2xl">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-xs uppercase tracking-wider text-ink-soft">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={update('nombre')}
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
                  type="email"
                  value={form.email}
                  onChange={update('email')}
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
                rows={4}
                value={form.mensaje}
                onChange={update('mensaje')}
                placeholder="Cuéntame sobre tu proyecto..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Mensajes de estado */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {sent && (
              <p className="text-sm text-ink">
                ¡Gracias! Tu mensaje está listo. Pronto conectaré el envío real.
              </p>
            )}

            <button type="button" onClick={handleSend} className="pill self-start">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
