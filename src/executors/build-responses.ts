import { STATUS_TEXT } from "~/constants"
import { OpenAPITransformerNS } from "~/types"
import inferSchemaFromExample from "../utils/infer-schema-from-example"
import { sanitizePath } from "~/utils/sanitize-path"
import transformHeaders from "../utils/transform-headers"
import maybeRef from "./maybe-ref"

export default function buildResponses(items: any, ctx: OpenAPITransformerNS.BuildContext, path?: string) {
  const res: any = {}
  const statusText = { ...STATUS_TEXT, ...(ctx.options.statusTextOverrides ?? {}) }

  for (const item of items) {
    if (typeof (item as any) === "number") {
      res[item] = { description: statusText[item] ?? "Response" }
      continue
    }

    const instance = typeof item === "function" ? new (item as any)() : item

    if ("code" in instance) {
      const { headers, code, content } = ctx.options.responseTemplate(
        instance instanceof OpenAPITransformerNS.AbstractException ? null : instance,
        instance instanceof OpenAPITransformerNS.AbstractException ? instance : null
      )

      const example = typeof content === "string" ? JSON.parse(content) ?? "Response content" : "Buffer"

      if ("__$schemaName" in instance && instance) (instance as any).name = instance.__$schemaName
      res[code] = {
        description: "message" in instance ? instance.message : statusText[code] ?? "",
        headers: transformHeaders(headers),
        content: {
          "application/json": {
            schema: maybeRef(
              instance,
              inferSchemaFromExample(JSON.parse(content)),
              ctx,
              path ? `${ sanitizePath(path) }_Response` : undefined,
              example
            )
          }
        }
      }
    }
  }

  return res
}

