import { OpenApiTransformerNS } from "~/types"
import recursiveParseObjectProperties from "./recursive-parse-object-properties"

export default function inferSchemaFromExample(value: any): OpenApiTransformerNS.AnyConvertedSchema {
  if (typeof value === "string") return { type: "string" }
  if (typeof value === "number") return { type: "number" }
  if (typeof value === "boolean") return { type: "boolean" }
  if (Array.isArray(value)) return { type: "array" }
  if (typeof value === "object") return { type: "object", properties: recursiveParseObjectProperties(value) }
  return {}
}