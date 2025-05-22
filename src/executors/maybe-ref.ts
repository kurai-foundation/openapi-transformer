import crypto from "crypto"
import { OpenAPITransformerNS } from "~/types"
import generateAutoName from "../utils/generate-auto-name"

export default function maybeRef(
  instance: OpenAPITransformerNS.AbstractException | OpenAPITransformerNS.AbstractSigilResponse | OpenAPITransformerNS.AnyConvertedSchema,
  schemaObj: OpenAPITransformerNS.AnyConvertedSchema,
  ctx: OpenAPITransformerNS.BuildContext,
  pathSchemaName?: string,
  example?: any
) {
  const { extractSchemas } = ctx.options

  if (extractSchemas === "none") return schemaObj

  if ("name" in instance && typeof instance.name === "string") {
    const name = instance.name

    if (!ctx.options.extractSchemas || ctx.options.extractSchemas) {
      ctx.components.schemas[name] = schemaObj

      if (example) ctx.components.schemas[name].example = example
    }

    return { $ref: `#/components/schemas/${ name }` }
  }

  if (extractSchemas === "all") {
    const json = JSON.stringify(schemaObj)
    const hash = crypto.createHash("sha1").update(json).digest("hex")
    let name = ctx.byHash.get(hash)
    if (!name) {
      name = generateAutoName(ctx, pathSchemaName)
      ctx.byHash.set(hash, name)
      ctx.components.schemas ??= {}

      const { description, example, deprecated, default: def, externalDocs, readOnly, writeOnly } = instance as any
      ctx.components.schemas[name] = {
        description, example, deprecated, default: def, externalDocs, readOnly, writeOnly,
        ...schemaObj
      }

      if (example) ctx.components.schemas[name].example = example
    }
    return { $ref: `#/components/schemas/${ name }` }
  }

  return schemaObj
}
