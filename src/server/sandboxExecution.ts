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

const COMMANDS: Record<string, { cmd: string; file: string }> = {
  javascript: { cmd: "node", file: "main.js" },
  js: { cmd: "node", file: "main.js" },
  typescript: { cmd: "npx", file: "main.ts" },
  ts: { cmd: "npx", file: "main.ts" },
  python: { cmd: "python3", file: "main.py" },
  py: { cmd: "python3", file: "main.py" },
  ruby: { cmd: "ruby", file: "main.rb" },
  php: { cmd: "php", file: "main.php" },
  go: { cmd: "go", file: "main.go" },
  rust: { cmd: "rustc", file: "main.rs" },
  rs: { cmd: "rustc", file: "main.rs" },
};

export async function executeInSandbox(code: string, language: string): Promise<SandboxExecutionResult> {
  const started = Date.now();
  const lang = (language || "").toLowerCase();
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

  try {
    const sandbox = await Sandbox.create({
      timeout: 30_000,
      networkPolicy: "deny-all",
    });

    try {
      await sandbox.writeFiles([{ path: spec.file, content: Buffer.from(code || "") }]);

      let args: string[];
      if (lang === "rust" || lang === "rs") {
        args = [spec.file, "-o", "main"];
        const compile = await sandbox.runCommand({ cmd: spec.cmd, args });
        const compileOut = await compile.stdout();
        const compileErr = await compile.stderr();
        if (compile.exitCode !== 0) {
          return {
            success: false,
            output: compileOut,
            errors: compileErr || "Rust compilation failed.",
            duration: `${Date.now() - started}ms`,
            exitCode: compile.exitCode,
            sandboxAvailable: true,
          };
        }
        const run = await sandbox.runCommand({ cmd: "./main", args: [] });
        return {
          success: run.exitCode === 0,
          output: await run.stdout(),
          errors: await run.stderr(),
          duration: `${Date.now() - started}ms`,
          exitCode: run.exitCode,
          sandboxAvailable: true,
        };
      }

      if (lang === "typescript" || lang === "ts") {
        args = ["tsx", spec.file];
      } else {
        args = [spec.file];
      }

      const run = await sandbox.runCommand({ cmd: spec.cmd, args });
      return {
        success: run.exitCode === 0,
        output: await run.stdout(),
        errors: await run.stderr(),
        duration: `${Date.now() - started}ms`,
        exitCode: run.exitCode,
        sandboxAvailable: true,
      };
    } finally {
      await sandbox.stop();
    }
  } catch (error: any) {
    return {
      success: false,
      output: "",
      errors: `Sandbox execution unavailable: ${error?.message || String(error)}. Configure Vercel Sandbox credentials/access before enabling real execution.`,
      duration: `${Date.now() - started}ms`,
      exitCode: 1,
      sandboxAvailable: false,
    };
  }
}
