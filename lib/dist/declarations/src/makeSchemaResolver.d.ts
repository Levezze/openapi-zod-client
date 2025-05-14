import type { OpenAPIObject, SchemaObject } from "openapi3-ts";
type RefInfo = {
    ref: string;
    name: string;
    normalized: string;
};
export declare const makeSchemaResolver: (doc: OpenAPIObject) => {
    getSchemaByRef: (ref: string) => SchemaObject;
    resolveRef: (ref: string) => RefInfo;
    resolveSchemaName: (normalized: string) => RefInfo;
};
export type DocumentResolver = ReturnType<typeof makeSchemaResolver>;
export {};
