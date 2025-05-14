import type { ReferenceObject, SchemaObject } from "openapi3-ts";
import type { DocumentResolver } from "./makeSchemaResolver";
export type ConversionTypeContext = {
    resolver: DocumentResolver;
    zodSchemaByName: Record<string, string>;
    schemaByName: Record<string, string>;
    schemasByName?: Record<string, string[]>;
};
export type CodeMetaData = {
    isRequired?: boolean;
    name?: string;
    parent?: CodeMeta;
    referencedBy?: CodeMeta[];
};
type DefinedCodeMetaProps = "referencedBy";
type DefinedCodeMetaData = Pick<Required<CodeMetaData>, DefinedCodeMetaProps> & Omit<CodeMetaData, DefinedCodeMetaProps>;
export declare class CodeMeta {
    schema: SchemaObject | ReferenceObject;
    ctx?: ConversionTypeContext | undefined;
    private code?;
    ref?: string;
    children: CodeMeta[];
    meta: DefinedCodeMetaData;
    constructor(schema: SchemaObject | ReferenceObject, ctx?: ConversionTypeContext | undefined, meta?: CodeMetaData);
    get codeString(): string;
    get complexity(): number;
    assign(code: string): this;
    inherit(parent?: CodeMeta): this;
    toString(): string;
    toJSON(): string;
}
export {};
