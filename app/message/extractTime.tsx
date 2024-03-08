// Helper function to pad single-digit numbers with a leading zero
function padZero(number: number) {
    return number.toString().padStart(2, '0')
}

export function extractTime(dateString: string) {
    const date = new Date(dateString)
    const hours = padZero(date.getHours())
    const minutes = padZero(date.getMinutes())
    return `${hours}:${minutes}`
}
