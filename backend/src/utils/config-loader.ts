import { readFileSync } from "fs"
import * as yaml from "js-yaml"

export const configLoader = (configFile: string) => () =>
  yaml.load(
    readFileSync(configFile, 'utf8').replace(/\$\{([^}]+)\}/g, (_, key) => process.env[key]),
  ) as Record<string, any>
