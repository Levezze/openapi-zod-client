import type { OpenAPIObject } from "openapi3-ts";
import { expect, test } from "vitest";
import { getZodClientTemplateContext } from "../src/template-context";

// Test the `allOf` case of not respecting the requirements array:
// Required field merging in allOf without flags

test("allOf should properly merge required fields from all parts", async () => {
    // Schema with multiple allOf parts that have different required fields
    const openApiDocAllOfRequired: OpenAPIObject = {
        openapi: "3.0.3",
        info: { title: "Test", version: "1.0.0" },
        paths: {},
        components: {
            schemas: {
                Example: {
                    allOf: [
                        {
                            type: "object",
                            properties: { foo: { type: "string" }, bar: { type: "number" } },
                            required: ["foo"],
                        },
                        {
                            type: "object",
                            properties: { baz: { type: "boolean" } },
                            required: ["baz"],
                        },
                    ],
                },
            },
        },
    };
    
    // Get schema without implicit required flag
    const templateContextRequired = getZodClientTemplateContext(openApiDocAllOfRequired, { 
        shouldExportAllTypes: true, 
        shouldExportAllSchemas: true 
    });
    
    // Get schema data
    const exampleSchemaRequired = templateContextRequired.schemas['Example'];
    expect(exampleSchemaRequired).toBeDefined();
    
    console.log('Required fields in allOf:', exampleSchemaRequired);
    const exampleSchemaRequiredStr = String(exampleSchemaRequired);
    
    // The first object should have foo required (no optional) and bar optional
    expect(exampleSchemaRequiredStr).toContain('foo: z.string()');
    expect(exampleSchemaRequiredStr).toContain('bar: z.number().optional()');
    // And another object with baz required
    expect(exampleSchemaRequiredStr).toContain('baz: z.boolean()');
    // Combined with .and()
    expect(exampleSchemaRequiredStr).toContain('.and(');
    // Shouldn't have .partial() since none of the required arrays are empty
    expect(exampleSchemaRequiredStr).not.toContain('.partial()');
    
});

test("RegisterUser example with $ref allOf should properly merge required fields", async () => {
    // Example from GitHub issue with $ref in allOf
    const openApiDocRegisterUser: OpenAPIObject = {
        openapi: "3.0.3",
        info: { title: "Test", version: "1.0.0" },
        paths: {},
        components: {
            schemas: {
                UserInputBase: {
                    type: "object",
                    description: "Base fields for user.",
                    properties: {
                        email: { type: "string", format: "email", maxLength: 100 },
                        username: { type: "string", minLength: 3, maxLength: 20 },
                        userAddress: { type: "string" }
                    },
                    required: ["email", "username"]
                },
                RegisterUser: {
                    type: "object",
                    description: "Request body for user registration.",
                    allOf: [
                        { $ref: "#/components/schemas/UserInputBase" },
                        { 
                            type: "object", 
                            properties: { password: { type: "string", minLength: 8 } },
                            required: ["password"]
                        }
                    ],
                    // All these fields should be required, not partial
                    required: ["email", "username", "password"]
                }
            },
        },
    };
    
    const templateContextRegisterUser = getZodClientTemplateContext(openApiDocRegisterUser, { 
        shouldExportAllTypes: true, 
        shouldExportAllSchemas: true 
    });
    
    // Get schema and verify it exists
    const registerUserSchema = templateContextRegisterUser.schemas['RegisterUser'];
    expect(registerUserSchema).toBeDefined();
    
    console.log('RegisterUser schema:', registerUserSchema);
    const registerUserSchemaStr = String(registerUserSchema);
    
    // When using $ref, it uses the reference name followed by .and() pattern
    expect(registerUserSchemaStr).toContain('UserInputBase.and(');
    expect(registerUserSchemaStr).toContain('password: z.string().min(8)');
    // Should not apply .partial() to RegisterUser since none of the required arrays are empty
    expect(registerUserSchemaStr).not.toContain('.partial()');
});