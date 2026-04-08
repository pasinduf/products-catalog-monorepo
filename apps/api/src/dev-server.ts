/**
 * Local dev server for debugging.
 * Bypasses serverless-offline so Node.js debugger attaches directly to
 * the Express app process — enabling full breakpoint support in VS Code.
 *
 * Run via: npm run debug (or the VS Code launch config)
 * This is NOT used in production — production uses handler.ts via Lambda.
 */
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { app } from "./app";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`[Debug Server] API running at http://localhost:${PORT}`);
});
