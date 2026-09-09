import fs from "node:fs";

const serverPath = "server.ts";
const serverSource = fs.readFileSync(serverPath, "utf8");

const executionImport = 'import { executeInSandbox } from "./src/server/sandboxExecution";';
const polyglotImport = 'import { analyzeCodeOffline, generateChatOffline } from "./src/server/polyglotEngine";';

let serverPatched = serverSource;

// Secure execution: replace the old simulated execution route exactly once.
if (!serverPatched.includes(executionImport)) {
  if (!serverPatched.includes(polyglotImport)) {
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

  serverPatched = serverPatched.replace(
    polyglotImport,
    `${polyglotImport}\n${executionImport}`
  );

  const startMarker = "// 4. Code Execution / Simulation Engine";
  const endMarker = "// 5. GitHub Integration API";
  const start = serverPatched.indexOf(startMarker);
  const end = serverPatched.indexOf(endMarker);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not locate the existing simulated /api/execute route markers");
  }

  serverPatched = serverPatched.slice(0, start) + secureRoute + serverPatched.slice(end);
}

// Vercel integration: never claim a deployment happened unless Vercel confirms it.
const vercelStartMarker = '// 6. Vercel Integration API';
const vercelEndMarker = '// 7. Replit Integration API';
const vercelStart = serverPatched.indexOf(vercelStartMarker);
const vercelEnd = serverPatched.indexOf(vercelEndMarker);

if (vercelStart !== -1 && vercelEnd !== -1 && vercelEnd > vercelStart) {
  const realVercelRoute = `// 6. Vercel Integration API
app.post("/api/vercel/deploy", async (req, res) => {
  try {
    const { projectName, branch } = req.body || {};
    const token = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const repo = process.env.GITHUB_REPO || "smurari229-ai/Omitool";
    const ref = branch || "main";

    if (!token) {
      return res.status(503).json({
        success: false,
        code: "VERCEL_TOKEN_MISSING",
        message: "Real Vercel deployment is disabled until VERCEL_TOKEN is configured on the server.",
      });
    }

    const payload = {
      name: projectName || undefined,
      project: projectId || undefined,
      target: "production",
      gitSource: {
        type: "github",
        org: repo.split("/")[0],
        repo: repo.split("/")[1],
        ref,
      },
    };

    const vercelResponse = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await vercelResponse.json().catch(() => ({}));
    if (!vercelResponse.ok) {
      return res.status(vercelResponse.status).json({
        success: false,
        code: data?.error?.code || "VERCEL_DEPLOY_FAILED",
        message: data?.error?.message || "Vercel rejected the deployment request.",
      });
    }

    return res.json({
      success: true,
      deploymentId: data.id,
      previewUrl: data.url ? `https://${data.url}` : undefined,
      dashboardUrl: data.inspectorUrl || "https://vercel.com/dashboard",
      target: data.target || "production",
      message: "Vercel accepted the real deployment request.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      code: "VERCEL_DEPLOY_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

`;

  serverPatched = serverPatched.slice(0, vercelStart) + realVercelRoute + serverPatched.slice(vercelEnd);
}

if (serverPatched !== serverSource) {
  fs.writeFileSync(serverPath, serverPatched);
  console.log("Applied secure execution and honest Vercel deployment routes to server.ts");
}

// Remove misleading client-side fake deployment generation before Vite builds the app.
const vercelUiPath = "src/components/VercelPlatform.tsx";
if (fs.existsSync(vercelUiPath)) {
  let ui = fs.readFileSync(vercelUiPath, "utf8");

  ui = ui.replace(
    /const \[deployments, setDeployments\] = useState<VercelDeployment\[\]>\(\[[\s\S]*?\n  \]\);/,
    `const [deployments, setDeployments] = useState<VercelDeployment[]>([]);`
  );
  ui = ui.replace(
    /const \[activeDeploymentUrl, setActiveDeploymentUrl\] = useState\('[^']*'\);/,
    `const [activeDeploymentUrl, setActiveDeploymentUrl] = useState('');`
  );
  ui = ui.replace(
    /const \[envVars, setEnvVars\] = useState<VercelEnvVar\[\]>\(\[[\s\S]*?\n  \]\);/,
    `const [envVars, setEnvVars] = useState<VercelEnvVar[]>([]);`
  );

  const handlerStart = ui.indexOf("const handleTriggerDeploy = () => {");
  const handlerEnd = ui.indexOf("  const handleCopyUrl", handlerStart);
  if (handlerStart !== -1 && handlerEnd !== -1) {
    const realHandler = `const handleTriggerDeploy = async () => {
    setIsDeploying(true);
    setActiveTab('deployments');
    setDeployPipelineLogs([
      { step: 'Sending deployment request to the backend', status: 'running' },
      { step: 'Vercel validates credentials and project', status: 'pending' },
      { step: 'Vercel builds the selected Git reference', status: 'pending' },
      { step: 'Vercel assigns the deployment URL', status: 'pending' },
    ]);

    try {
      const response = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: 'omitool', branch: 'main' }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Vercel deployment was not accepted.');
      }

      const url = data.previewUrl || '';
      const deployment: VercelDeployment = {
        id: data.deploymentId || 'unknown',
        name: 'omitool',
        url: url ? (url.startsWith('http') ? url : \`https://\${url}\`) : '',
        branch: 'main',
        commitHash: 'server-confirmed',
        commitMessage: 'Vercel deployment accepted by API',
        status: 'BUILDING',
        environment: data.target === 'production' ? 'Production' : 'Preview',
        creator: 'Vercel API',
        duration: 'pending',
        deployedAt: 'just now',
        edgeRegion: 'Vercel-managed',
        metrics: { ttfb: 'pending', bundleSize: 'pending', edgeExecutionTime: 'pending' },
      };
      setDeployments([deployment]);
      setActiveDeploymentUrl(deployment.url);
      setDeployPipelineLogs([
        { step: 'Sending deployment request to the backend', status: 'done', time: 'confirmed' },
        { step: 'Vercel validates credentials and project', status: 'done', time: 'confirmed' },
        { step: 'Vercel builds the selected Git reference', status: 'running' },
        { step: 'Vercel assigns the deployment URL', status: deployment.url ? 'done' : 'pending', time: deployment.url ? 'received' : undefined },
      ]);
    } catch (err: any) {
      setDeployPipelineLogs([
        { step: 'Sending deployment request to the backend', status: 'done' },
        { step: 'Vercel deployment', status: 'pending' },
      ]);
      setDeployments([]);
      setActiveDeploymentUrl('');
      console.error('Vercel deployment error:', err);
    } finally {
      setIsDeploying(false);
    }
  };

`;
    ui = ui.slice(0, handlerStart) + realHandler + ui.slice(handlerEnd);
  }

  ui = ui.replace(/<span>Production: Live<\/span>/, `<span>Vercel: API-backed</span>`);
  ui = ui.replace(/<span className="text-\[11px\] text-emerald-400 font-mono flex items-center gap-1">[\s\S]*?<\/span>/, `<span className="text-[11px] text-slate-400 font-mono">Live metrics appear after a real deployment</span>`);
  ui = ui.replace(/Vercel Edge Sandbox Preview/g, "Vercel Deployment Preview");
  ui = ui.replace(/This application was compiled and distributed across 320\+ global Edge Points of Presence with zero cold start latency\./g, "Preview content is shown locally. Open the deployment URL after Vercel confirms a real deployment.");
  ui = ui.replace(/SSL Certificate: Active \(Let's Encrypt\)/g, "SSL: managed by Vercel after deployment");

  fs.writeFileSync(vercelUiPath, ui);
}
