import { OpenApiTransformerNS } from "~/types"

export default function copyMeta(descriptor: OpenApiTransformerNS.AnyConvertedSchema): Partial<OpenApiTransformerNS.AnyConvertedSchema> {
  const m: any = {}
  for (const k of ["description", "nullable", "deprecated", "example", "default"]) {
    if (k in descriptor) m[k] = descriptor[k]
  }
  return m
}