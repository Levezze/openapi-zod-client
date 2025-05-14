import type { ReferenceObject, SchemaObject } from "openapi3-ts";
import { ts } from "tanu";
import type { TypeDefinitionObject } from "tanu/dist/type";
import type { DocumentResolver } from "./makeSchemaResolver";
import type { TemplateContext } from "./template-context";
type TsConversionArgs = {
    schema: SchemaObject | ReferenceObject;
    ctx?: TsConversionContext | undefined;
    meta?: {
        name?: string;
        $ref?: string;
        isInline?: boolean;
    } | undefined;
    options?: TemplateContext["options"];
};
export type TsConversionContext = {
    nodeByRef: Record<string, ts.Node>;
    resolver: DocumentResolver;
    rootRef?: string;
    visitedsRefs?: Record<string, boolean>;
};
export declare const getTypescriptFromOpenApi: ({ schema, meta: inheritedMeta, ctx, options, }: TsConversionArgs) => ts.Node | TypeDefinitionObject | string;
export {};
