import { OpenAPITransformerNS } from "~/types"

export default function copyMeta(descriptor: OpenAPITransformerNS.AnyConvertedSchema): Partial<OpenAPITransformerNS.AnyConvertedSchema> {
  const m: any = {}
  for (const k of ["description", "nullable", "deprecated", "example", "default"]) {
    if (k in descriptor) m[k] = descriptor[k]
  }
  return m
}