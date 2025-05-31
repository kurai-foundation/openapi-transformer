export interface OpenApiServerDescriptor {
  url: string
  description?: string
  variables?: Record<string, any>
}

export interface OpenApiTransformerTransformOptions {
  extractSchemas?: "none" | "named" | "all"
  schemaNameStrategy?: "hash" | "path" | "increment"
  statusTextOverrides?: Record<number, string>
  ignoreRoutes?: (string | RegExp)[] | ((path: string) => boolean)
}

type SecurityOAuthFlows = {
  implicit: {
    authorizationUrl: string
    refreshUrl?: string
    scopes: Record<string, string>
  }
  password: {
    tokenUrl: string
    refreshUrl?: string
    scopes: Record<string, string>
  }
  clientCredentials: {
    tokenUrl: string
    refreshUrl?: string
    scopes: Record<string, string>
  },
  authorizationCode: {
    authorizationUrl: string
    refreshUrl?: string
    tokenUrl?: string
    scopes: Record<string, string>
  }
}

export type SecuritySchemaDescriptor =
  ({ type: "http", scheme: "basic" }
    | { type: "http", scheme: "bearer", bearerFormat?: string }
    | { type: "apiKey", name: string, in: "header" }
    | { type: "apiKey", name: string, in: "query" }
    | { type: "apiKey", name: string, in: "cookie" }
    | { type: "oauth2", flows: SecurityOAuthFlows }
    | { type: "openIdConnect", openIdConnectUrl: string })
  & { description?: string }

export interface OpenApiTransformerInfoOptions {
  title: string

  description: string

  servers: OpenApiServerDescriptor[]

  termsOfService: string

  contact: Partial<{
    name: string
    url: string
    email: string
  }>

  license: {
    name: string
    url?: string
  }

  version: string

  securitySchemas?: Record<string, SecuritySchemaDescriptor>

  security?: Record<string, string[] | boolean>[] | Record<string, string[] | boolean> | string[] | string | null
}

export namespace OpenApiTransformerNS {
  export abstract class AbstractException {
    public abstract __$name?: string
    public abstract __$description?: string
    public abstract __$headers?: Record<string, string>
    public abstract code: number
    public abstract name: string
    public abstract message: string
  }

  export abstract class AbstractSigilResponse {
    public abstract __$schemaName?: string
    public abstract code: number
    public abstract headers: Record<string, string>
    public abstract content: any
  }

  export type ResponseTemplateCallback = (content: any, error: any) => {
    headers: Record<string, any>,
    code: number,
    content: string | Buffer
  }

  export type BuildContext = {
    options: Omit<OpenApiTransformerTransformOptions, "responseTemplate"> & { responseTemplate: any, nameStrategy?: string },
    anonCount: number,
    byHash: Map<string, string>
    components: { schemas: Record<string, any>, responses: Record<string, any>, securitySchemes?: Record<string, SecuritySchemaDescriptor> }
  }

  export interface AnyConvertedSchema {
    type?: string
    properties?: AnyConvertedSchema

    [key: string]: any
  }

  export type FlatRequestSchema = Partial<{
    body: Record<string, any>
    headers: Record<string, any>
    query: Record<string, any>
    params: Record<string, any>
  }>

  export type RequestMetadataDescriptor = {
    description: string
    responses: Array<any>
    example: any
    deprecated: boolean
    externalDocs: {
      description: string
      url: string
    }
  }

  export interface ExportedRouteDetails {
    method: string
    path: string
    schema: FlatRequestSchema
    tags: string[]
    meta: Partial<RequestMetadataDescriptor>
  }
}