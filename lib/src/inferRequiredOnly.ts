import { type SchemaObject, type ReferenceObject, isReferenceObject } from "openapi3-ts";
import type { DocumentResolver } from "./makeSchemaResolver";

const isBrokenAllOfItem = (item: SchemaObject | ReferenceObject): item is SchemaObject => {
    return (
        !isReferenceObject(item) &&
        !!item.required &&
        !item.type &&
        !item.properties &&
        !item?.allOf &&
        !item?.anyOf &&
        !item.oneOf
    );
};

export function inferRequiredSchema(schema: SchemaObject, parentRequired?: string[]) {
    if (!schema.allOf) {
        throw new Error(
            "function inferRequiredSchema is specialized to handle item with required only in an allOf array."
        );
    }
    
    // Merge parent required fields (from the parent schema) with requireds from allOf items
    const mergedRequired = new Set([...(parentRequired ?? []), ...((schema.required ?? []))]);

    const [standaloneRequisites, noRequiredOnlyAllof] = schema.allOf.reduce(
        (acc, cur) => {
            if (isBrokenAllOfItem(cur)) {
                const required = cur.required;
                acc[0].push(...(required ?? []));
            } else {
                acc[1].push(cur);
            }

            return acc;
        },
        [[], []] as [string[], Array<SchemaObject | ReferenceObject>]
    );

    // Use mergedRequired as the definitive required fields
    const composedRequiredSchema = {
        properties: Array.from(mergedRequired).reduce(
            (acc, cur) => {
                acc[cur] = {
                    // type: "unknown" as SchemaObject["type"],
                } as SchemaObject;
                return acc;
            },
            {} as {
                [propertyName: string]: SchemaObject | ReferenceObject;
            }
        ),
        type: "object" as const,
        required: Array.from(mergedRequired),
    };


    return {
        noRequiredOnlyAllof,
        composedRequiredSchema,
        patchRequiredSchemaInLoop: (prop: SchemaObject | ReferenceObject, resolver: DocumentResolver) => {
            if (isReferenceObject(prop)) {
                const refType = resolver.getSchemaByRef(prop.$ref);
                if (refType) {
                    composedRequiredSchema.required.forEach((required) => {
                        composedRequiredSchema.properties[required] = refType?.properties?.[required] ?? {};
                    });
                }
            } else {
                const properties = prop.properties ?? {};
                composedRequiredSchema.required.forEach((required) => {
                    if (properties[required]) {
                        composedRequiredSchema.properties[required] = properties[required] ?? {};
                    }
                });
            }
        },
    };
}