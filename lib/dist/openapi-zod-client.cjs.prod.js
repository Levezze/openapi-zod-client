'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generateZodClientFromOpenAPI = require('./generateZodClientFromOpenAPI-2d46be68.cjs.prod.js');
require('node:path');
require('pastable/server');
require('ts-pattern');
require('handlebars');
require('prettier');
require('prettier/parser-typescript');
require('tanu');
require('whence');
require('openapi3-ts');



exports.generateZodClientFromOpenAPI = generateZodClientFromOpenAPI.generateZodClientFromOpenAPI;
exports.getHandlebars = generateZodClientFromOpenAPI.getHandlebars;
exports.getOpenApiDependencyGraph = generateZodClientFromOpenAPI.getOpenApiDependencyGraph;
exports.getZodClientTemplateContext = generateZodClientFromOpenAPI.getZodClientTemplateContext;
exports.getZodSchema = generateZodClientFromOpenAPI.getZodSchema;
exports.getZodiosEndpointDefinitionList = generateZodClientFromOpenAPI.getZodiosEndpointDefinitionList;
exports.maybePretty = generateZodClientFromOpenAPI.maybePretty;
