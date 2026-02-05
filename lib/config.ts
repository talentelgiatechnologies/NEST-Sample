export function config() {
    const host = process.env['IMAGE_HOST'];
    return {
        PROFILE_PATH: host + process.env['PROFILE_PATH']?.replace('public/', '/assets/') + "/",
        EXPERIENCE_PATH: host + process.env['EXPERIENCE_PATH']?.replace('public/', '/assets/') + "/",
        LIST_META_PATH: host + process.env['LIST_META_PATH']?.replace('public/', '/assets/') + "/",
        PROPERTY_PATH: host + process.env['PROPERTY_PATH']?.replace('public/', '/assets/') + "/",
        DOCUMENT_PATH: host + process.env['DOCUMENT_PATH']?.replace('public/', '/assets/') + "/",
        SITE_PATH: host + process.env['SITE_PATH']?.replace('public/', '/assets/') + "/",
        TWILIO_ACCOUNT_SID: process.env['TWILIO_ACCOUNT_SID'],
        TWILIO_AUTH_TOKEN: process.env['TWILIO_AUTH_TOKEN'],
        TWILIO_PHONE_NUMBER: process.env['TWILIO_PHONE_NUMBER'],
        allowedCities: process.env['ALLOWED_CITIES']?.split(",") || [],
        SITE_HOST: process.env['SITE_HOST'],
        CORE_URL: process.env['CORE_URL'],
        WOMPI_PAYOUT_URL: process.env['WOMPI_PAYOUT_URL'],
        WOMPI_USER_PRINCIPAL_ID_SANDBOX: process.env['WOMPI_USER_PRINCIPAL_ID_SANDBOX'],
        WOMPI_X_API_KEY_SANDBOX: process.env['WOMPI_X_API_KEY_SANDBOX'],
        ADMIN_EMAIL: process.env['ADMIN_EMAIL'],
    }
}