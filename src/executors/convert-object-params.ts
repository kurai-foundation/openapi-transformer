import { OpenApiTransformerNS } from "~/types"
import convertSchema from "./convert-schema"

export default function convertObjectParams(objSchema: OpenApiTransformerNS.AnyConvertedSchema, place: "path" | "query" | "header", ctx: OpenApiTransformerNS.BuildContext) {
  const params: any[] = []
  const schema = objSchema.shape

  for (const key in schema) {
    const field = schema[key]

    params.push({
      name: key,
      in: place,
      required: !field.optional,
      schema: convertSchema(field, ctx),
      description: field.description
    })
  }
  return params
}
