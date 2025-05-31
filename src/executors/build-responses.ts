import { STATUS_TEXT } from "~/constants"
import { OpenApiTransformerNS } from "~/types"
import inferSchemaFromExample from "../utils/infer-schema-from-example"
import { sanitizePath } from "~/utils/sanitize-path"
import transformHeaders from "../utils/transform-headers"
import maybeRef from "./maybe-ref"

export default function buildResponses(items: any, ctx: OpenApiTransformerNS.BuildContext, path?: string) {
  const res: any = {}
  const statusText = { ...STATUS_TEXT, ...(ctx.options.statusTextOverrides ?? {}) }

  for (const item of items) {
    if (typeof (item as any) === "number") {
      res[item] = { description: statusText[item] ?? "Response" }
      continue
    }

    const instance = typeof item === "function" ? new (item as any)() : item

    if ("code" in instance) {
      const { headers, code, content } = ctx.options.responseTemplate(instance)

      const _content = instance.__$raw === true ? (instance.content ? JSON.stringify(instance.content) : content) : content

      const example = typeof _content === "string" ? JSON.parse(_content) ?? "Response content" : "Buffer"

      if ("__$schemaName" in instance && instance) instance.name = instance.__$schemaName
      const responseContent = {
        description: instance.__$description || ("message" in instance ? instance.message : statusText[code] ?? ""),
        headers: transformHeaders(headers),
        content: {
          "application/json": {
            schema: maybeRef(
              instance,
              inferSchemaFromExample(JSON.parse(_content)),
              ctx,
              path ? `${ sanitizePath(path) }_Response` : undefined,
              example
            )
          }
        }
      }

      if (instance.name) {
        ctx.components.responses[instance.name] = responseContent
        res[code] = { $ref: `#/components/responses/${ instance.name }` }
      }
      else res[code] = responseContent
    }
  }

  return res
}

