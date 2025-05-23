import { OpenApiTransformerNS } from "~/types"
import { sanitizePath } from "~/utils/sanitize-path"
import buildResponses from "./build-responses"
import convertObjectParams from "./convert-object-params"
import convertSchema from "./convert-schema"

interface IBuildOperationOptions {
  meta?: Record<string, any>
  path?: string
  tags: string[]
  schema: OpenApiTransformerNS.FlatRequestSchema,
  ctx: OpenApiTransformerNS.BuildContext,
}

export default function buildOperation({ meta, path, tags, schema, ctx }: IBuildOperationOptions) {
  const op: any = {}

  if (meta?.deprecated) op.deprecated = true
  if (meta?.description) op.description = meta.description
  if (meta?.externalDocs) op.externalDocs = meta.externalDocs
  if (tags) op.tags = tags

  op.parameters = []

  if (schema.params) {
    op.parameters.push(...convertObjectParams(schema.params, "path", ctx))
  }
  if (schema.query) {
    op.parameters.push(...convertObjectParams(schema.query, "query", ctx))
  }
  if (schema.headers) {
    op.parameters.push(...convertObjectParams(schema.headers, "header", ctx))
  }

  if (schema.body) {
    op.requestBody = {
      required: true,
      content: {
        "application/json": { schema: convertSchema(schema.body, ctx, path ? `${ sanitizePath(path) }_Body` : undefined) }
      }
    }
  }

  op.responses = buildResponses(meta?.responses ?? [], ctx, path)
  if (Object.keys(op.responses).length === 0) {
    op.responses["200"] = { description: "Success" }
  }

  return op
}