import { type SchemaObject, type ReferenceObject } from "openapi3-ts";
import type { DocumentResolver } from "./makeSchemaResolver";
export declare function inferRequiredSchema(schema: SchemaObject): {
    noRequiredOnlyAllof: (SchemaObject | ReferenceObject)[];
    composedRequiredSchema: {
        properties: {
            [propertyName: string]: SchemaObject | ReferenceObject;
        };
        type: "object";
        required: string[];
    };
    patchRequiredSchemaInLoop: (prop: SchemaObject | ReferenceObject, resolver: DocumentResolver) => void;
};
