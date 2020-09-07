declare function buildCommand(configPath: string, specFilePath: string, runArgs?: {
    [k: string]: string;
}, envVars?: {
    [k: string]: string;
}): string;
export { buildCommand };
