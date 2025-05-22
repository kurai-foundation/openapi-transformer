export namespace OpenAPITransformerNS {
  export abstract class AbstractException {
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

  export interface TransformOptions {
    extractSchemas?: "none" | "named" | "all";
    schemaNameStrategy?: "hash" | "path" | "increment";
    statusTextOverrides?: Record<number, string>;
  }

  export interface ISwaggerServer {
    url: string
    description?: string
    variables?: Record<string, any>
  }

  export interface Details {
    title: string
    description: string
    servers: ISwaggerServer[]

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
  }

  export type BuildContext = {
    options: Required<Omit<OpenAPITransformerNS.TransformOptions, "responseTemplate">> & { responseTemplate: any },
    anonCount: number,
    byHash: Map<string, string>
    components: { schemas: Record<string, any> }
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