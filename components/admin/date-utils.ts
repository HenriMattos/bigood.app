export function toDateInputValue(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const [day, month, year] = value.split("/")

  return [year, month, day].filter(Boolean).join("-")
}

export function formatDateForDisplay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const [year, month, day] = value.split("-")

  return `${day}/${month}/${year}`
}
