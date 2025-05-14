import type { ZodiosEndpointDefinition } from "@zodios/core";
import type { OpenAPIObject, SchemaObject } from "openapi3-ts";
import type { TemplateContext } from "./template-context";
export declare const getZodiosEndpointDefinitionList: (doc: OpenAPIObject, options?: TemplateContext["options"]) => {
    endpoints: EndpointDefinitionWithRefs[];
    issues: {
        ignoredFallbackResponse: string[];
        ignoredGenericError: string[];
    };
    refsDependencyGraph: Record<string, Set<string>>;
    deepDependencyGraph: Record<string, Set<string>>;
    resolver: {
        getSchemaByRef: (ref: string) => SchemaObject;
        resolveRef: (ref: string) => {
            ref: string;
            name: string;
            normalized: string;
        };
        resolveSchemaName: (normalized: string) => {
            ref: string;
            name: string;
            normalized: string;
        };
    };
    zodSchemaByName: Record<string, string>;
    schemaByName: Record<string, string>;
    schemasByName: Record<string, string[]>;
};
export type EndpointDefinitionWithRefs = Omit<ZodiosEndpointDefinition<any>, "response" | "parameters" | "errors" | "description"> & {
    response: string;
    description?: string | undefined;
    parameters: Array<Omit<Required<ZodiosEndpointDefinition<any>>["parameters"][number], "schema"> & {
        schema: string;
    }>;
    errors: Array<Omit<Required<ZodiosEndpointDefinition<any>>["errors"][number], "schema"> & {
        schema: string;
    }>;
    responses?: Array<{
        statusCode: string;
        schema: string;
        description?: string;
    }>;
};
