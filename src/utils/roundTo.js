export default function roundTo(num, decimals=2) {
  const factor = Math.pow(10, decimals)

  return Math.round(num * factor) / factor
}
