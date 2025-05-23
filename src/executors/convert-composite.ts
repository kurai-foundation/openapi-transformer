import { OpenApiTransformerNS } from "~/types"
import convertSchema from "./convert-schema"

export default function convertComposite(sourceSchema: OpenApiTransformerNS.AnyConvertedSchema, ctx: OpenApiTransformerNS.BuildContext, path?: string) {
  switch (sourceSchema.type) {
    case "oneOf":
      return { oneOf: sourceSchema.oneOf.map((v: any) => convertSchema(v, ctx, path)) }
    case "allOf":
      return { allOf: sourceSchema.allOf.map((v: any) => convertSchema(v, ctx, path)) }
    case "anyOf":
      return { anyOf: sourceSchema.anyOf.map((v: any) => convertSchema(v, ctx, path)) }
    case "not":
      return {
        allOf: sourceSchema.allOf.map((v: any) => convertSchema(v, ctx, path)),
        not: convertSchema(sourceSchema.not, ctx, path)
      }
  }
}
