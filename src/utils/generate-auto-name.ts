import crypto from "crypto"
import { OpenApiTransformerNS } from "~/types"

export default function generateAutoName(ctx: OpenApiTransformerNS.BuildContext, pathSchemaName?: string) {
  switch (ctx.options.schemaNameStrategy) {
    case "increment":
      return `UnnamedSchema${ ++ctx.anonCount }`
    case "path":
      if (pathSchemaName) return `Schema_${ pathSchemaName }`
      else return `Schema_${ crypto.randomBytes(4).toString("hex") }`
    case "hash":
    default:
      return `Schema_${ crypto.randomBytes(4).toString("hex") }`
  }
}
