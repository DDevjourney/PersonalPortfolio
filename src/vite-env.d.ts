/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ID del servicio de EmailJS (panel de EmailJS → Email Services) */
  readonly VITE_EMAILJS_SERVICE_ID?: string
  /** ID de la plantilla de EmailJS (panel → Email Templates) */
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  /** Public Key de EmailJS (panel → Account → API Keys) */
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
