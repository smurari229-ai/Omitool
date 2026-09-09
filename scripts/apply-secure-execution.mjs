import fs from "node:fs";

const path = "server.ts";
const source = fs.readFileSync(path, "utf8");

if (source.includes("executeInSandbox")) {
  process.exit(0);
}

const importLine = 'import { analyzeCodeOffline, generateChatOffline } from "./src/server/polyglotEngine";';
if (!source.includes(importLine)) {
  throw new Error("Expected polyglotEngine import was not found in server.ts");
}

const secureRoute = `// 4. Secure Code Execution Engine
app.post("/api/execute", async (req, res) => {
  const startTime = Date.now();
  try {
    const { code, language } = req.body || {};
    if (typeof code !== "string") {
      return res.status(400).json({
        success: false,
        output: "",
        errors: "Code must be a string.",
        duration: "0ms",
        exitCode: 2,
        sandboxAvailable: false,
      });
    }

    const result = await executeInSandbox(code, language || "");
    return res.json({
      success: result.success,
      output: result.output,
      errors: result.errors,
      duration: result.duration || \`${"${"}Date.now() - startTime}ms\`,
      memory: result.memory,
      exitCode: result.exitCode,
      sandboxAvailable: result.sandboxAvailable,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      output: "",
      errors: err instanceof Error ? err.message : String(err),
      duration: \`${"${"}Date.now() - startTime}ms\`,
      exitCode: 1,
      sandboxAvailable: false,
    });
  }
});

`;

const withImport = source.replace(
  importLine,
  `${importLine}\nimport { executeInSandbox } from "./src/server/sandboxExecution";`
);

const startMarker = "// 4. Code Execution / Simulation Engine";
const endMarker = "// 5. GitHub Integration API";
const start = withImport.indexOf(startMarker);
const end = withImport.indexOf(endMarker);

if (start === -1 || end === -1 || end <= start) {
  throw new Error("Could not locate the existing /api/execute route markers");
}

const patched = withImport.slice(0, start) + secureRoute + withImport.slice(end);
fs.writeFileSync(path, patched);
console.log("Applied secure /api/execute route to server.ts");
