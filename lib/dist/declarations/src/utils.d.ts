import type { SchemaObject } from "openapi3-ts";
export declare const asComponentSchema: (name: string) => string;
export declare function normalizeString(text: string): string;
export declare const wrapWithQuotesIfNeeded: (str: string) => string;
export declare const pathParamToVariableName: (name: string) => string;
export declare const replaceHyphenatedPath: (path: string) => string;
/** @example turns `/media-objects/{id}` into `MediaObjectsId` */
export declare const pathToVariableName: (path: string) => string;
type SingleType = Exclude<SchemaObject["type"], any[] | undefined>;
export declare const isPrimitiveType: (type: SingleType) => type is "string" | "number" | "boolean" | "integer" | "null";
declare const primitiveTypeList: readonly ["string", "number", "integer", "boolean", "null"];
export type PrimitiveType = typeof primitiveTypeList[number];
export declare const escapeControlCharacters: (str: string) => string;
export declare const toBoolean: (value: undefined | string | boolean, defaultValue: boolean) => boolean;
export {};
