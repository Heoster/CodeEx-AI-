declare module 'dotenv' {
  export function config(options?: { path?: string; encoding?: string }): void;
  const dot: { parsed?: Record<string, string> };
  export default dot;
}
