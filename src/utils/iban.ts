export function normalizeIBAN(iban: string) {
  return iban.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

export function ibanToNumericString(iban: string) {
  // Move first four chars to the end
  const rearranged = iban.slice(4) + iban.slice(0, 4)
  let result = ''
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0)
    if (code >= 65 && code <= 90) {
      // A = 10, B = 11, ... Z = 35
      result += (code - 55).toString()
    } else {
      result += ch
    }
  }
  return result
}

export function mod97(largeNumericStr: string) {
  // perform mod 97 iteratively to avoid big integers
  let remainder = 0
  let fragment = ''
  for (let i = 0; i < largeNumericStr.length; i += 7) {
    fragment = String(remainder) + largeNumericStr.substring(i, i + 7)
    remainder = parseInt(fragment, 10) % 97
  }
  return remainder
}

export function isValidIBAN(ibanInput: string) {
  if (!ibanInput || typeof ibanInput !== 'string') return false
  const iban = normalizeIBAN(ibanInput)
  if (iban.length < 15 || iban.length > 34) return false
  if (!/^[A-Z0-9]+$/.test(iban)) return false
  const numeric = ibanToNumericString(iban)
  const remainder = mod97(numeric)
  return remainder === 1
}

export default isValidIBAN
