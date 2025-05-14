// Utility for debug logging to file
import * as fs from "node:fs";

const DEBUG_LOG_PATH = process.env['OPENAPI_ZOD_DEBUG_LOG_PATH'] || "./openapi-zod-debug.log";

export function debugLogToFile(...args: any[]) {
    const msg = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a, null, 2))).join(" ");
    fs.appendFileSync(DEBUG_LOG_PATH, msg + "\n");
}
