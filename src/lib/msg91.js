const BASE_URL = "https://control.msg91.com/api/v5/otp";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`SMS verification is not configured. Set ${name}.`);
  }
  return value;
}

// MSG91 expects the mobile number with country code and no leading "+".
function toMsg91Mobile(e164Phone) {
  return e164Phone.replace(/^\+/, "");
}

export async function sendOtp(phone) {
  const authkey = requireEnv("MSG91_AUTH_KEY");
  const templateId = requireEnv("MSG91_TEMPLATE_ID");
  const mobile = toMsg91Mobile(phone);

  const url = `${BASE_URL}?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(mobile)}&authkey=${encodeURIComponent(authkey)}`;
  const res = await fetch(url, { method: "POST" });
  const data = await res.json().catch(() => null);

  if (!res.ok || data?.type === "error") {
    throw new Error(data?.message || "Couldn't send the verification code");
  }

  return data;
}

export async function checkOtp(phone, otp) {
  const authkey = requireEnv("MSG91_AUTH_KEY");
  const mobile = toMsg91Mobile(phone);

  const url = `${BASE_URL}/verify?otp=${encodeURIComponent(otp)}&mobile=${encodeURIComponent(mobile)}`;
  const res = await fetch(url, { method: "GET", headers: { authkey } });
  const data = await res.json().catch(() => null);

  const approved = res.ok && data?.type === "success";
  return { status: approved ? "approved" : "failed", raw: data };
}
