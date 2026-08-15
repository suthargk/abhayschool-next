import { SCHOOL_LOGO_BASE64 } from "./logo-base64";

export const LOGO_CID = "school-logo";
export const BRAND_FROM = "#8371fa";
export const BRAND_TO = "#c25ff9";
export const SCHOOL_NAME = "Shri Abhay Nobles Senior Secondary School, Takhatgarh";

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

export function detailRow(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 20px;border-bottom:1px solid #eee;font-size:13px;color:#6b7280;white-space:nowrap;vertical-align:top;width:160px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 20px;border-bottom:1px solid #eee;font-size:14px;color:#111827;vertical-align:top;">
        ${escapeHtml(value)}
      </td>
    </tr>`;
}

export function logoAttachment() {
  return { filename: "logo.png", content: Buffer.from(SCHOOL_LOGO_BASE64, "base64"), cid: LOGO_CID };
}

/**
 * Table-based email shell shared by all transactional emails: branded
 * gradient header with the school logo/name, a body slot, an optional CTA
 * button, and a footer disclaimer. Inline styles only (no external
 * stylesheet, no flex/grid) for compatibility with Outlook and other email
 * clients that don't render a full CSS engine.
 */
export function emailShell({ title, heading, intro, bodyHtml, cta, footerNote }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:${BRAND_FROM};background-image:linear-gradient(135deg,${BRAND_FROM},${BRAND_TO});padding:28px 24px;text-align:center;">
                <img src="cid:${LOGO_CID}" width="56" height="56" alt="${escapeHtml(SCHOOL_NAME)}" style="display:block;margin:0 auto 10px;border-radius:50%;background-color:#ffffff;padding:4px;" />
                <span style="display:block;color:#ffffff;font-size:17px;font-weight:600;letter-spacing:0.2px;">
                  ${escapeHtml(SCHOOL_NAME)}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px 8px;">
                <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">${escapeHtml(heading)}</h1>
                <p style="margin:0;font-size:14px;color:#6b7280;">
                  ${escapeHtml(intro)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 4px 4px;">
                ${bodyHtml}
              </td>
            </tr>
            ${
              cta
                ? `<tr>
              <td style="padding:24px 24px 28px;text-align:center;">
                <a href="${cta.href}" style="display:inline-block;background-color:${BRAND_FROM};background-image:linear-gradient(135deg,${BRAND_FROM},${BRAND_TO});color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
                  ${escapeHtml(cta.label)}
                </a>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:16px 24px 24px;border-top:1px solid #eee;">
                <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                  ${escapeHtml(footerNote)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
