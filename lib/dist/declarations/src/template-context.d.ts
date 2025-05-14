import type { OpenAPIObject, OperationObject, ReferenceObject, SchemaObject } from "openapi3-ts";
import type { EndpointDefinitionWithRefs } from "./getZodiosEndpointDefinitionList";
import type { CodeMetaData } from "./CodeMeta";
export declare const getZodClientTemplateContext: (openApiDoc: OpenAPIObject, options?: TemplateContext["options"]) => TemplateContext;
type MinimalTemplateContext = Pick<TemplateContext, "endpoints" | "schemas" | "types"> & {
    imports?: Record<string, string>;
};
export type TemplateContext = {
    schemas: Record<string, string>;
    endpoints: EndpointDefinitionWithRefs[];
    endpointsGroups: Record<string, MinimalTemplateContext>;
    types: Record<string, string>;
    circularTypeByName: Record<string, true>;
    emittedType: Record<string, true>;
    commonSchemaNames?: Set<string>;
    options?: TemplateContextOptions | undefined;
};
export type TemplateContextGroupStrategy = "none" | "tag" | "method" | "tag-file" | "method-file";
export type TemplateContextOptions = {
    /** @see https://www.zodios.org/docs/client#baseurl */
    baseUrl?: string;
    /**
     * When true, will either use the `operationId` as `alias`, or auto-generate it from the method and path.
     *
     * You can alternatively provide a custom function to generate the alias with the following signature:
     * `(path: string, method: string, operation: OperationObject) => string`
     * `OperationObject` is the OpenAPI operation object as defined in `openapi3-ts` npm package.
     * @see https://github.com/metadevpro/openapi3-ts/blob/master/src/model/OpenApi.ts#L110
     *
     * @see https://www.zodios.org/docs/client#zodiosalias
     * @default true
     */
    withAlias?: boolean | ((path: string, method: string, operation: OperationObject) => string);
    /**
     * when using the default `template.hbs`, allow customizing the `export const {apiClientName}`
     *
     * @default "api"
     */
    apiClientName?: string;
    /**
     * when defined, will be used to pick which endpoint to use as the main one and set to `ZodiosEndpointDefinition["response"]`
     * will use `default` status code as fallback
     *
     * @see https://www.zodios.org/docs/api/api-definition#api-definition-structure
     *
     * works like `validateStatus` from axios
     * @see https://github.com/axios/axios#handling-errors
     *
     * @default `(status >= 200 && status < 300)`
     */
    isMainResponseStatus?: string | ((status: number) => boolean);
    /**
     * when defined, will be used to pick which endpoints should be included in the `ZodiosEndpointDefinition["errors"]` array
     * ignores `default` status
     *
     * @see https://www.zodios.org/docs/api/api-definition#errors
     *
     * works like `validateStatus` from axios
     * @see https://github.com/axios/axios#handling-errors
     *
     * @default `!(status >= 200 && status < 300)`
     */
    isErrorStatus?: string | ((status: number) => boolean);
    /**
     * when defined, will be used to pick the first MediaType found in ResponseObject["content"] map matching the given expression
     *
     * context: some APIs returns multiple media types for the same response, this option allows you to pick which one to use
     * or allows you to define a custom media type to use like `application/json-ld` or `application/vnd.api+json`) etc...
     * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#response-object
     * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#media-types
     *
     * @default `mediaType === "application/json"`
     */
    isMediaTypeAllowed?: string | ((mediaType: string) => boolean);
    /** if OperationObject["description"] is not defined but the main ResponseObject["description"] is defined, use the latter as ZodiosEndpointDefinition["description"] */
    useMainResponseDescriptionAsEndpointDefinitionFallback?: boolean;
    /**
     * when true, will export all `#/components/schemas` even when not used in any PathItemObject
     * @see https://github.com/astahmer/openapi-zod-client/issues/19
     */
    shouldExportAllSchemas?: boolean;
    /**
     * When true, will generate and output types for all schemas, not just circular ones.
     * This helps with "The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed.ts(7056)" errors.
     */
    shouldExportAllTypes?: boolean;
    /**
     * when true, will make all properties of an object required by default (rather than the current opposite), unless an explicitly `required` array is set
     * @see https://github.com/astahmer/openapi-zod-client/issues/23
     */
    withImplicitRequiredProps?: boolean;
    /**
     * when true, will add the default values from the openapi schemas to the generated zod schemas
     *
     * @default true
     */
    withDefaultValues?: boolean;
    /**
     * when true, will keep deprecated endpoints in the api output
     * @default false
     */
    withDeprecatedEndpoints?: boolean;
    /**
     * when true, will add jsdoc comments to generated types
     * @default false
     */
    withDocs?: boolean;
    /**
     * groups endpoints by a given strategy
     *
     * when strategy is "tag" and multiple tags are defined for an endpoint, the first one will be used
     *
     * @default "none"
     */
    groupStrategy?: TemplateContextGroupStrategy;
    /**
     * schema complexity threshold to determine which one (using less than `<` operator) should be assigned to a variable
     * tl;dr higher means more schemas will be inlined (rather than assigned to a variable)
     * ^ if you want to always inline schemas, set it to `-1` (special value) or a high value such as `1000`
     * v if you want to assign all schemas to a variable, set it to `0`
     *
     * @default 4
     */
    complexityThreshold?: number;
    /**
     * when defined as "auto-correct", will automatically use `default` as fallback for `response` when no status code was declared
     *
     * - if no main response has been found, this should be considered it as a fallback
     * - else this will be added as an error response
     *
     * @see https://github.com/astahmer/openapi-zod-client/pull/30#issuecomment-1280434068
     *
     * @default "spec-compliant"
     */
    defaultStatusBehavior?: "spec-compliant" | "auto-correct";
    willSuppressWarnings?: boolean;
    /**
     * when true, will add z.describe(xxx)
     * @see https://github.com/astahmer/openapi-zod-client/pull/143
     */
    withDescription?: boolean;
    /**
     * A function to refine the default endpoint definition. Mostly useful for adding fields from OperationObject
     * that aren't defined yet in the default definition.
     */
    endpointDefinitionRefiner?: (defaultDefinition: EndpointDefinitionWithRefs, operation: OperationObject) => EndpointDefinitionWithRefs;
    /**
     * When true, all generated objects and arrays will be readonly.
     */
    allReadonly?: boolean;
    /**
     * When true, all generated zod objects will be strict - meaning no unknown keys will be allowed
     */
    strictObjects?: boolean;
    /**
     * Set default value when additionalProperties is not provided. Default to true.
     */
    additionalPropertiesDefaultValue?: boolean | SchemaObject;
    /**
     * When true, returns a "responses" array with all responses (both success and errors)
     */
    withAllResponses?: boolean;
    /**
     * When true, prevents using the exact same name for the same type
     * For example, if 2 schemas have the same type, but different names, export each as separate schemas
     * If 2 schemas have the same name but different types, export subsequent names with numbers appended
     */
    exportAllNamedSchemas?: boolean;
    /**
     * A function that runs in the schema conversion process to refine the schema before it's converted to a Zod schema.
     */
    schemaRefiner?: <T extends SchemaObject | ReferenceObject>(schema: T, parentMeta?: CodeMetaData) => T;
};
export {};
