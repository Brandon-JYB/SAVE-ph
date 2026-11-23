import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendConfirmationEmail({ name, email, farm, date, reference }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.log("EmailJS env:", { service: !!SERVICE_ID, template: !!TEMPLATE_ID, key: !!PUBLIC_KEY });
    console.warn("EmailJS keys are missing in .env, so no email was sent.");
    return { ok: false };
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: name,
        to_email: email,
        farm_name: farm,
        visit_date: date,
        reference_code: reference,
      },
      { publicKey: PUBLIC_KEY }
    );
    return { ok: true };
  } catch (err) {
    console.error("Confirmation email failed:", err);
    return { ok: false };
  }
}