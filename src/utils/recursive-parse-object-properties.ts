export default function recursiveParseObjectProperties(obj: any): any {
  if (!obj || typeof obj !== "object" || !Object.keys(obj).length) return {}

  return Object.fromEntries(Object.entries(obj).map(([k, v]) => {
    if (typeof v === "object" && v) {
      if (Array.isArray(v)) return [k, { type: "array", items: {} }]
      return [k, { type: "object", properties: recursiveParseObjectProperties(v) }]
    }

    if (!v) return [k, { type: "object", nullable: true }]
    return [k, { type: typeof v }]
  }))
}
