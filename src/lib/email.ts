/**
 * Resend email helpers.
 *
 * Required env vars:
 *   RESEND_API_KEY   — from resend.com dashboard
 *   OWNER_EMAIL      — where owner notifications are delivered
 *   FROM_EMAIL       — verified sender address on your Resend domain
 *                      e.g. "VTP Trčka <noreply@vtptrcka.cz>"
 *
 * If RESEND_API_KEY is not set the functions are no-ops (dev mode).
 */

import type { Inquiry } from "./types";

function resendAvailable(): boolean {
  return !!process.env.RESEND_API_KEY;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("cs-CZ", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Prague",
  });
}

// ── HTML templates ────────────────────────────────────────────────────────────

function customerHtml(inquiry: Inquiry): string {
  const phoneRow = inquiry.phone
    ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;width:90px">Telefon</td><td style="padding:6px 0;font-size:13px">${inquiry.phone}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:28px 36px">
            <div style="display:inline-block;height:4px;width:40px;background:linear-gradient(to right,#f06820,#0047ab);margin-bottom:12px"></div>
            <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px">VTP Trčka</div>
            <div style="color:#888888;font-size:12px;margin-top:2px">Vodo · Topo · Plyn</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 36px 28px">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0a0a0a">Děkujeme za Váš zájem!</p>
            <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.7">
              Dobrý den, <strong>${inquiry.name}</strong>,<br>
              obdrželi jsme Vaši zprávu a ozveme se Vám hned, jak to bude možné.
              Obvyklá doba odpovědi je do 24 hodin v pracovní dny.
            </p>

            <!-- Submitted details -->
            <div style="background:#f8f8f8;border-left:3px solid #f06820;padding:20px 24px;border-radius:0 4px 4px 0">
              <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:.1em">Vaše zpráva</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr><td style="padding:6px 0;color:#888;font-size:13px;width:90px">Jméno</td><td style="padding:6px 0;font-size:13px">${inquiry.name}</td></tr>
                <tr><td style="padding:6px 0;color:#888;font-size:13px">E-mail</td><td style="padding:6px 0;font-size:13px">${inquiry.email}</td></tr>
                ${phoneRow}
                <tr><td colspan="2" style="padding-top:14px;border-top:1px solid #e8e8e8"></td></tr>
                <tr><td colspan="2" style="padding:10px 0;font-size:13px;color:#333;line-height:1.7;white-space:pre-wrap">${inquiry.message}</td></tr>
              </table>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px 32px;border-top:1px solid #eeeeee">
            <p style="margin:0 0 6px;font-size:13px;color:#aaaaaa">V případě dotazů nás kontaktujte:</p>
            <p style="margin:0;font-size:13px;color:#555">
              📞 <a href="tel:+420731863896" style="color:#f06820;text-decoration:none">+420 731 863 896</a>
              &nbsp;·&nbsp;
              <a href="tel:+420603162571" style="color:#f06820;text-decoration:none">+420 603 162 571</a>
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#cccccc">756 12 Horní Lideč</p>
          </td>
        </tr>

      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#aaaaaa">Tento e-mail byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function ownerHtml(inquiry: Inquiry): string {
  const phoneRow = inquiry.phone
    ? `<tr><td style="padding:8px 12px;color:#888;font-size:13px;background:#f8f8f8;width:100px;border-bottom:1px solid #eee">Telefon</td><td style="padding:8px 12px;font-size:13px;border-bottom:1px solid #eee">${inquiry.phone}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:22px 36px">
            <div style="color:#f06820;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase">Nová poptávka</div>
            <div style="color:#ffffff;font-size:18px;font-weight:700;margin-top:4px">${inquiry.name}</div>
            <div style="color:#666;font-size:12px;margin-top:2px">${formatDate(inquiry.createdAt)}</div>
          </td>
        </tr>

        <!-- Contact details table -->
        <tr>
          <td style="padding:0">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #eee">
              <tr><td style="padding:8px 12px;color:#888;font-size:13px;background:#f8f8f8;width:100px;border-bottom:1px solid #eee">Jméno</td><td style="padding:8px 12px;font-size:13px;border-bottom:1px solid #eee">${inquiry.name}</td></tr>
              <tr>
                <td style="padding:8px 12px;color:#888;font-size:13px;background:#f8f8f8;border-bottom:1px solid #eee">E-mail</td>
                <td style="padding:8px 12px;font-size:13px;border-bottom:1px solid #eee">
                  <a href="mailto:${inquiry.email}" style="color:#f06820;text-decoration:none">${inquiry.email}</a>
                </td>
              </tr>
              ${phoneRow}
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:24px 36px 32px">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:.1em">Zpráva</p>
            <p style="margin:0;font-size:14px;color:#333;line-height:1.8;white-space:pre-wrap">${inquiry.message}</p>

            <!-- Quick reply button -->
            <div style="margin-top:28px">
              <a href="mailto:${inquiry.email}?subject=Re: Vaše poptávka — VTP Trčka"
                 style="display:inline-block;background:#f06820;color:#ffffff;font-size:13px;font-weight:700;padding:12px 24px;text-decoration:none;border-radius:2px;letter-spacing:.03em">
                Odpovědět zákazníkovi
              </a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Send functions ────────────────────────────────────────────────────────────

export async function sendConfirmationEmail(inquiry: Inquiry): Promise<void> {
  if (!resendAvailable()) return;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.FROM_EMAIL ?? "VTP Trčka <noreply@vtptrcka.cz>";

  const { error } = await resend.emails.send({
    from,
    to: inquiry.email,
    subject: "Děkujeme za Váš zájem — VTP Trčka",
    html: customerHtml(inquiry),
  });

  if (error) console.error("[email] customer confirmation failed:", error);
}

export async function sendOwnerNotification(inquiry: Inquiry): Promise<void> {
  if (!resendAvailable()) return;

  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) {
    console.warn("[email] OWNER_EMAIL not set — skipping owner notification");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.FROM_EMAIL ?? "VTP Trčka <noreply@vtptrcka.cz>";

  const { error } = await resend.emails.send({
    from,
    to: ownerEmail,
    replyTo: inquiry.email,
    subject: `Nová poptávka od ${inquiry.name}`,
    html: ownerHtml(inquiry),
  });

  if (error) console.error("[email] owner notification failed:", error);
}
