import buildOperation from "./executors/build-operation"
import { OpenAPITransformerNS } from "./types"
import colonToBraces from "./utils/colon-to-braces"

interface OpenAPIDocumentOptions extends Partial<OpenAPITransformerNS.Details> {
  responseTemplate: OpenAPITransformerNS.ResponseTemplateCallback
  transform?: OpenAPITransformerNS.TransformOptions
}

export default class OpenApiTransformer {
  private readonly servers: OpenAPITransformerNS.ISwaggerServer[]
  private readonly transformOptions?: OpenAPITransformerNS.TransformOptions
  private readonly responseTemplate: OpenAPITransformerNS.ResponseTemplateCallback
  private readonly info: Record<string, any>

  constructor(options: OpenAPIDocumentOptions) {
    const { servers, transform, responseTemplate, ..._details } = options ?? {}

    this.servers = servers || [{
      url: "{scheme}://{host}:{port}",
      variables: {
        scheme: { default: "http", enum: ["http", "https"] },
        host: { default: "localhost" },
        port: { default: "3000" }
      }
    }]

    this.transformOptions = transform
    this.responseTemplate = responseTemplate
    this.info = Object.assign({
      title: "API documentation",
      version: "1.0.0",
      description: "This API documentation was automatically generated using Sigil OpenAPI transformer"
    }, _details)
  }

  public transform(routes: OpenAPITransformerNS.ExportedRouteDetails[]) {
    const ctx = {
      options: {
        extractSchemas: "named",
        nameStrategy: "path",
        ...this.transformOptions,
        responseTemplate: this.responseTemplate
      },
      anonCount: 0,
      byHash: new Map<string, string>(),
      components: { schemas: {} }
    }

    const o: any = {
      openapi: "3.0.3",
      info: this.info,
      servers: this.servers,
      paths: {},
      components: ctx.components
    }

    for (const route of routes) {
      const oasPath = colonToBraces(route.path)
      if (!o.paths[oasPath]) o.paths[oasPath] = {}
      o.paths[oasPath][route.method.toLowerCase()] = buildOperation({
        ...route, ctx: ctx as any
      })
    }

    return o
  }
}
