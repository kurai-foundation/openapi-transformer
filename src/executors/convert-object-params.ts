import { OpenAPITransformerNS } from "~/types"
import convertSchema from "./convert-schema"

export default function convertObjectParams(objSchema: OpenAPITransformerNS.AnyConvertedSchema, place: "path" | "query" | "header", ctx: OpenAPITransformerNS.BuildContext) {
  const params: any[] = []
  const schema = objSchema.shape

  //const required: string[] = []
  for (const key in schema) {
    const field = schema[key]
    //if (!field.optional) required.push(key)

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
