import { OpenApiTransformerNS } from "~/types"
import copyMeta from "../utils/copy-meta"
import convertComposite from "./convert-composite"
import maybeRef from "./maybe-ref"

export default function convertSchema(sourceSchema: OpenApiTransformerNS.AnyConvertedSchema, ctx: OpenApiTransformerNS.BuildContext, pathSchemaName?: string): any {
  if (sourceSchema.type === "object") {
    const out: any = { type: "object" }
    if (sourceSchema.loose) out.additionalProperties = true

    const props: any = {}
    const req: string[] = []

    for (const k in sourceSchema.shape) {
      props[k] = convertSchema(sourceSchema.shape[k], ctx, pathSchemaName)
      if (!sourceSchema.shape[k].optional) req.push(k)
    }
    out.properties = props
    if (req.length) out.required = req

    return maybeRef(sourceSchema, out, ctx, pathSchemaName)
  }

  if (sourceSchema.type === "array") {
    const out: any = { type: "array" }

    if (Array.isArray(sourceSchema.tuple)) {
      if (sourceSchema.tuple.length === 1) {
        out.items = convertSchema(sourceSchema.tuple[0], ctx, pathSchemaName)
      }
      else {
        out.items = sourceSchema.tuple.map((el: any) => convertSchema(el, ctx, pathSchemaName))
        out.minItems = sourceSchema.tuple.length
        out.maxItems = sourceSchema.tuple.length
      }
    }
    if ("minItems" in sourceSchema) out.minItems = sourceSchema.minItems
    if ("maxItems" in sourceSchema) out.maxItems = sourceSchema.maxItems
    if (sourceSchema.uniqueItems) out.uniqueItems = true

    if (sourceSchema.valid) out.enum = sourceSchema.valid
    //if (s.invalid) out.not = { enum: s.invalid }

    return maybeRef(sourceSchema, out, ctx, pathSchemaName)
  }

  switch (sourceSchema.type) {
    case "string":
      return {
        ...copyMeta(sourceSchema), type: "string",
        enum: sourceSchema.valid // , not: s.invalid && { enum: s.invalid }
      }
    case "boolean":
      return { ...copyMeta(sourceSchema), type: "boolean" }
    case "float":
    case "double":
    case "number":
    case "integer": // includes format
      return { ...copyMeta(sourceSchema), type: sourceSchema.type, format: sourceSchema.format }
    case "oneOf":
    case "allOf":
    case "anyOf":
    case "not":
      return convertComposite(sourceSchema, ctx, pathSchemaName)
  }

  return {} // fallback
}
