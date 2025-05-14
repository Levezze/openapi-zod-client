'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./openapi-zod-client.cjs.prod.js");
} else {
  module.exports = require("./openapi-zod-client.cjs.dev.js");
}
