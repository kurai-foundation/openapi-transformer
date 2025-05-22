export default function colonToBraces(path: string) {
  return path.replace(/:([A-Za-z0-9_]+)/g, "{$1}").replace(/\*([A-Za-z0-9_]+)/g, "{$1}")
}
