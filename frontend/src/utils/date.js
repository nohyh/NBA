const pad = (value) => String(value).padStart(2, "0")

const toLocalDate = (value) => {
  if (!value) return null
  if (value instanceof Date) return value

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    }
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const getLocalDateString = (value = new Date()) => {
  const date = toLocalDate(value)
  if (!date) return ""
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const formatLocalDateYmd = (value) => getLocalDateString(value) || "-"

export const formatLocalDateMd = (value) => {
  const date = toLocalDate(value)
  if (!date) return "-"
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

