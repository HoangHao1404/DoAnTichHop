function normalizePhone(phone) {
  if (
    typeof phone !== "string" ||
    !/^\+?[0-9\s().-]{8,20}$/.test(phone.trim())
  ) {
    return "";
  }

  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length === 11) {
    digits = `0${digits.slice(2)}`;
  }

  return digits.length >= 8 && digits.length <= 15 ? digits : "";
}

module.exports = normalizePhone;
