import normalizeSecuritySchemas from "~/utils/normalize-security-schemas"
import buildOperation from "./executors/build-operation"
import {
  OpenApiServerDescriptor,
  OpenApiTransformerInfoOptions,
  OpenApiTransformerNS,
  OpenApiTransformerTransformOptions,
  SecuritySchemaDescriptor
} from "./types"
import colonToBraces from "./utils/colon-to-braces"
import BuildContext = OpenApiTransformerNS.BuildContext

export interface OpenApiTransformerOptions extends Partial<OpenApiTransformerInfoOptions> {
  responseTemplate: OpenApiTransformerNS.ResponseTemplateCallback
  transform?: OpenApiTransformerTransformOptions
}

export default class OpenApiTransformer {
  private readonly servers: OpenApiServerDescriptor[]
  private readonly transformOptions?: OpenApiTransformerTransformOptions
  private readonly responseTemplate: OpenApiTransformerNS.ResponseTemplateCallback
  private readonly info: Record<string, any>
  private readonly securitySchemas?: Record<string, SecuritySchemaDescriptor>
  private readonly security?: Record<string, string[]>[]

  constructor(options: OpenApiTransformerOptions) {
    const { servers, transform, responseTemplate, securitySchemas, security, ..._details } = options ?? {}

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
      description: "This API documentation was automatically generated using Sigil OpenAPI transformer",
    }, _details)
    if (securitySchemas) this.securitySchemas = securitySchemas
    if (security) this.security = normalizeSecuritySchemas(security)
  }

  public transform(routes: OpenApiTransformerNS.ExportedRouteDetails[]) {
    const ctx: BuildContext = {
      options: {
        extractSchemas: "named",
        nameStrategy: "path",
        ...this.transformOptions,
        responseTemplate: this.responseTemplate
      },
      anonCount: 0,
      byHash: new Map<string, string>(),
      components: {
        schemas: {},
        responses: {}
      }
    }

    if (this.securitySchemas) ctx.components.securitySchemes = this.securitySchemas

    const o: any = {
      openapi: "3.0.3",
      info: this.info,
      servers: this.servers,
      paths: {},
      components: ctx.components
    }

    if (this.security) o.security = this.security

    for (const route of routes) {
      if (this.transformOptions?.ignoreRoutes) {
        if (Array.isArray(this.transformOptions.ignoreRoutes)) {
          if (this.transformOptions.ignoreRoutes.some(pt => (
            typeof pt === "string" ? (route.path.startsWith(pt) || route.path === pt) : (pt.test(route.path))
          ))) continue
        } else if (this.transformOptions.ignoreRoutes(route.path)) continue
      }

      const oasPath = colonToBraces(route.path)
      if (!o.paths[oasPath]) o.paths[oasPath] = {}
      o.paths[oasPath][route.method.toLowerCase()] = buildOperation({
        ...route, ctx: ctx as any
      })
    }

    return o
  }
}
