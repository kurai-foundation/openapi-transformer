import buildOperation from "./executors/build-operation"
import { OpenApiServerDescriptor, OpenApiTransformerInfoOptions, OpenApiTransformerNS, OpenApiTransformerTransformOptions } from "./types"
import colonToBraces from "./utils/colon-to-braces"

export interface OpenApiTransformerOptions extends Partial<OpenApiTransformerInfoOptions> {
  responseTemplate: OpenApiTransformerNS.ResponseTemplateCallback
  transform?: OpenApiTransformerTransformOptions
}

export default class OpenApiTransformer {
  private readonly servers: OpenApiServerDescriptor[]
  private readonly transformOptions?: OpenApiTransformerTransformOptions
  private readonly responseTemplate: OpenApiTransformerNS.ResponseTemplateCallback
  private readonly info: Record<string, any>

  constructor(options: OpenApiTransformerOptions) {
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

  public transform(routes: OpenApiTransformerNS.ExportedRouteDetails[]) {
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
