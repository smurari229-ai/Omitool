import { Sandbox } from "@vercel/sandbox";

export type SandboxExecutionResult = {
  success: boolean;
  output: string;
  errors: string;
  duration: string;
  exitCode: number;
  memory?: string;
  sandboxAvailable: boolean;
};

// Only enable runtimes that are verified against the current Vercel Sandbox base images.
// Other languages must not receive simulated success; they are reported as unavailable.
const COMMANDS: Record<string, { cmd: string; args: string[]; runtime?: "node24" | "python3.13" }> = {
  javascript: { cmd: "node", args: ["main.js"], runtime: "node24" },
  js: { cmd: "node", args: ["main.js"], runtime: "node24" },
  python: { cmd: "python", args: ["main.py"], runtime: "python3.13" },
  py: { cmd: "python", args: ["main.py"], runtime: "python3.13" },
};

export async function executeInSandbox(code: string, language: string): Promise<SandboxExecutionResult> {
  const started = Date.now();
  const lang = (language || "").toLowerCase().trim();
  const spec = COMMANDS[lang];

  if (!spec) {
    return {
      success: false,
      output: "",
      errors: `Real execution is not configured for ${language || "this language"} yet. No simulated success is returned.`,
      duration: `${Date.now() - started}ms`,
      exitCode: 2,
      sandboxAvailable: false,
    };
  }

  let sandbox: Sandbox | null = null;
  try {
    sandbox = await Sandbox.create({
      runtime: spec.runtime,
      timeout: 30_000,
      networkPolicy: "deny-all",
      persistent: false,
    });

    await sandbox.writeFiles([
      { path: spec.args[0], content: Buffer.from(code || "") },
    ]);

    const run = await sandbox.runCommand({
      cmd: spec.cmd,
      args: spec.args,
    });

    const output = await run.stdout();
    const errors = await run.stderr();

    return {
      success: run.exitCode === 0,
      output,
      errors,
      duration: `${Date.now() - started}ms`,
      exitCode: run.exitCode,
      sandboxAvailable: true,
    };
  } catch (error: any) {
    return {
      success: false,
      output: "",
      errors: `Sandbox execution unavailable: ${error?.message || String(error)}. Configure Vercel Sandbox access before enabling real execution.`,
      duration: `${Date.now() - started}ms`,
      exitCode: 1,
      sandboxAvailable: false,
    };
  } finally {
    if (sandbox) {
      try {
        await sandbox.stop();
      } catch {
        // Preserve the execution result even if cleanup reports an error.
      }
    }
  }
}
