export type LanguageCategory =
  | 'popular'
  | 'systems'
  | 'web'
  | 'data_ai'
  | 'mobile'
  | 'functional'
  | 'scripting'
  | 'database'
  | 'hardware'
  | 'enterprise'
  | 'academic_historic';

export interface ProgrammingLanguage {
  id: string;
  name: string;
  category: LanguageCategory;
  extension: string;
  paradigm: string;
  runtime: string;
  defaultCode: string;
  sampleBugCode: string;
  bugDescription: string;
  replitTemplate: string;
  vercelReady: boolean;
  debuggingTips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  groundingSources?: Array<{ uri: string; title: string }>;
  usedWebSearch?: boolean;
}

export interface DebugIssue {
  line: number;
  severity: 'error' | 'warning' | 'info';
  title: string;
  explanation: string;
  suggestedFix: string;
}

export interface DebugReport {
  summary: string;
  issues: DebugIssue[];
  fixedCode: string;
  complexity: {
    time: string;
    space: string;
    explanation?: string;
  };
  securityAndPerformance: string[];
  groundingSources?: Array<{ uri: string; title: string }>;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  errors: string;
  duration: string;
  memory: string;
  exitCode: number;
  sandboxAvailable?: boolean;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  languageId: string;
  content: string;
  isModified?: boolean;
  // Backward-compatible fields used by the current workspace UI.
  language?: string;
  isEntry?: boolean;
  lastModified?: string;
}

// GitHub In-App Platform Types
export interface GitCommit {
  id: string;
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  authorEmail: string;
  timestamp: string;
  branch: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  codeSnapshot: string;
}

export interface GitBranch {
  name: string;
  isDefault: boolean;
  isCurrent: boolean;
  lastCommitHash: string;
}

export interface GitPullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  author: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed';
  createdTime: string;
  comments: Array<{ author: string; text: string; timestamp: string }>;
  diffSummary: string;
  mergeable: boolean;
}

export interface GitIssue {
  id: string;
  number: number;
  title: string;
  description: string;
  author: string;
  labels: string[];
  status: 'open' | 'closed';
  createdTime: string;
}

export interface GitGist {
  id: string;
  description: string;
  fileName: string;
  content: string;
  isPublic: boolean;
  createdTime: string;
  url: string;
}

// Vercel In-App Platform Types
export interface VercelDeployment {
  id: string;
  name: string;
  url: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  status: 'READY' | 'BUILDING' | 'QUEUED' | 'ERROR';
  environment: 'Production' | 'Preview';
  creator: string;
  duration: string;
  deployedAt: string;
  edgeRegion: string;
  metrics: {
    ttfb: string;
    bundleSize: string;
    edgeExecutionTime: string;
  };
}

export interface VercelEnvVar {
  id: string;
  key: string;
  value: string;
  environments: Array<'Production' | 'Preview' | 'Development'>;
  isSecret: boolean;
}

// Replit In-App Platform Types
export interface ReplitPackage {
  name: string;
  version: string;
  language: string;
  installed: boolean;
  description: string;
}

export interface ReplitTerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'prompt';
  text: string;
  timestamp?: string;
}

export interface ReplitTelemetry {
  cpuPercent: number;
  ramUsageMB: number;
  status: 'online' | 'running' | 'idle';
  storageMB: number;
}

export interface GitHubState {
  token: string;
  username: string;
  repoName: string;
  branch: string;
  commitMessage: string;
  status: 'idle' | 'testing' | 'publishing' | 'success' | 'error';
  statusMessage: string;
  gistUrl?: string;
  quickUrl?: string;
  workflowYaml?: string;
}

export interface VercelState {
  projectName: string;
  framework: string;
  deploymentStatus: 'idle' | 'building' | 'deployed' | 'error';
  previewUrl?: string;
  deploymentId?: string;
  logs: Array<{ step: string; status: string; time: string }>;
  vercelConfig?: string;
}

export interface ReplitState {
  dotReplit: string;
  replitNix: string;
  runCommand: string;
  status: 'ready' | 'generating' | 'synced';
}
