export default function transformHeaders(headers: Record<string, any>) {
  const res: any = {}
  for (const header in headers) res[header] = { schema: { type: "string" }, example: headers[header] }
  return res
}
