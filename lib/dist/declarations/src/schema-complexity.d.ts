import type { ReferenceObject, SchemaObject } from "openapi3-ts";
export declare function getSchemaComplexity({ current, schema, }: {
    current: number;
    schema: SchemaObject | ReferenceObject | undefined;
}): number;
