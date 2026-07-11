// Single source of truth for the school's phone number.
// Lebanese local number 03 353 530 -> international +961 3 353 530
// (the leading 0 is a trunk prefix and is dropped for the intl format).
export const PHONE_DISPLAY = '03 353 530'
export const PHONE_INTL_DISPLAY = '+961 3 353 530'

// wa.me deep link: works on desktop (opens WhatsApp Web / prompts to open the
// desktop app) and on mobile (opens the WhatsApp app directly) — no phone
// number formatting, spaces, or a leading + or 0 allowed.
export const WHATSAPP_URL = 'https://wa.me/9613353530'
