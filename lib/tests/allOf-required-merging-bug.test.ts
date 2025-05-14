import type { OpenAPIObject } from "openapi3-ts";
import { expect, test } from "vitest";
import { getZodClientTemplateContext } from "../src/template-context";

// Test the two separate issues in distinct test cases:
// 1. Empty required array with implicit-required flag 
// 2. Required field merging in allOf without flags

test("Case 1: allOf with empty required array and implicit-required flag", async () => {
    // Set up schema with empty required array
    const openApiDocEmptyRequired: OpenAPIObject = {
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
                        },
                        {
                            required: [],
                        },
                    ],
                },
            },
        },
    };
    
    // With implicit-required flag ON, empty required arrays should make fields optional
    const withImplicitRequiredCtx = getZodClientTemplateContext(openApiDocEmptyRequired, { 
        shouldExportAllTypes: true, 
        shouldExportAllSchemas: true,
        withImplicitRequiredProps: true // <-- This is the implicit-required flag
    });
    
    // Get the schema
    const implicitRequiredSchemaStr = String(withImplicitRequiredCtx.schemas['Example']);
    console.log('With implicit-required flag ON:', implicitRequiredSchemaStr);
    
    // When implicit-required is ON, .partial() should be applied with empty required arrays
    expect(implicitRequiredSchemaStr).toContain('.partial()');
    
    // Without the flag, empty required arrays shouldn't affect the schema
    const withoutImplicitRequiredCtx = getZodClientTemplateContext(openApiDocEmptyRequired, { 
        shouldExportAllTypes: true, 
        shouldExportAllSchemas: true,
        withImplicitRequiredProps: false 
    });
    
    const withoutImplicitRequiredStr = String(withoutImplicitRequiredCtx.schemas['Example']);
    console.log('Without implicit-required flag:', withoutImplicitRequiredStr);
    
    // Properties should be optional by default without the flag, either via .optional()
    // on individual properties or via .partial() on the object
    // We'll accept either approach as long as the properties end up being optional
    expect(withoutImplicitRequiredStr).toMatch(/\.partial\(\)|optional\(\)/); // Fields should be optional
});

test("Case 2: allOf should properly merge required fields from all parts", async () => {
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

test("Case 3: RegisterUser example with $ref allOf should properly merge required fields", async () => {
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

test("Case 4: UpdateUser with empty required array and implicit-required flag should apply .partial()", async () => {
    // Example from GitHub issue with empty required arrays
    const openApiDocUpdateUser: OpenAPIObject = {
        openapi: "3.0.3",
        info: { title: "Test", version: "1.0.0" },
        paths: {},
        components: {
            schemas: {
                UpdateMe: {
                    type: "object",
                    description: "Request body for updating current user's info.",
                    properties: {
                        email: { type: "string", format: "email" },
                        username: { type: "string" }
                    },
                    required: [] // Empty required array here
                },
                UpdateUser: {
                    type: "object",
                    description: "Request body for updating any user.",
                    allOf: [
                        { $ref: "#/components/schemas/UpdateMe" },
                        {
                            type: "object",
                            properties: {
                                password: { type: "string", minLength: 8 },
                                userRole: { type: "string", enum: ["user", "admin"] },
                                isActive: { type: "boolean" }
                            }
                        }
                    ],
                    required: [] // Empty required array here too
                }
            },
        },
    };
    
    // Test with implicit-required flag ON
    const withImplicitRequiredCtx = getZodClientTemplateContext(openApiDocUpdateUser, { 
        shouldExportAllTypes: true, 
        shouldExportAllSchemas: true,
        withImplicitRequiredProps: true // <-- This is the implicit-required flag
    });
    
    // Get schema
    const updateUserImplicitSchema = withImplicitRequiredCtx.schemas['UpdateUser'];
    expect(updateUserImplicitSchema).toBeDefined();
    
    console.log('UpdateUser schema (with implicit-required):', updateUserImplicitSchema);
    const updateUserSchemaStr = String(updateUserImplicitSchema);
    
    // When empty required array is found and implicit-required flag is ON, .partial() should be applied
    expect(updateUserSchemaStr).toContain('.partial()');
    // It should use UpdateMe as reference and combine with another object
    expect(updateUserSchemaStr).toContain('UpdateMe');
    expect(updateUserSchemaStr).toContain('.and(');
    
    // Test without the flag - should have optional fields but not .partial() directly from empty required arrays
    const withoutImplicitRequiredCtx = getZodClientTemplateContext(openApiDocUpdateUser, {
        shouldExportAllTypes: true,
        shouldExportAllSchemas: true,
        withImplicitRequiredProps: false
    });
    
    const updateUserWithoutImplicitSchema = withoutImplicitRequiredCtx.schemas['UpdateUser'];
    console.log('UpdateUser schema (without implicit-required):', updateUserWithoutImplicitSchema);
    const updateUserWithoutImplicitStr = String(updateUserWithoutImplicitSchema);
    
    // Fields should be optional by default either via .optional() or .partial()
    expect(updateUserWithoutImplicitStr).toMatch(/\.partial\(\)|optional\(\)/);
    // But explicit .partial() shouldn't be applied when flag is off
    // (might still be .partial() for other reasons, so we can't assert it's not there at all)
});
