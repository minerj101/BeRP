import chalk from 'chalk';
import fs from 'fs';
import { resolve } from 'path';
import { format } from 'util';

/* eslint-disable prefer-rest-params */
/**
 * Overrides basic console methods
 * @param dir Directory To Store Log History In
 */
export const overrideProcessConsole = (dir: string): void => {
  const lastSessionFile = resolve(dir, 'last-session.log')
  const combinedFile = resolve(dir, 'combined.log')

  fs.mkdirSync(dir, { recursive: true })
  const lastSessionStream = fs.createWriteStream(lastSessionFile)
  const combinedStream = fs.createWriteStream(combinedFile, { flags: "a" })

  function write(item: string): void {
    lastSessionStream.write(item)
    combinedStream.write(item)
  }
  function closeStreams(): void {
    lastSessionStream.close()
    combinedStream.close()
  }

  process.once('beforeExit', () => {
    closeStreams()
  })
  console.log = function(): void {
    process.stdout.write(format.apply(this, arguments) + '\n')
    write((format.apply(this, arguments))
      .replace(/\u001b\[.*?m/g, "") + "\n")
  }
  console.info = function(): void {
    process.stdout.write(format.apply(this, arguments) + '\n')
    write((format.apply(this, arguments))
      .replace(/\u001b\[.*?m/g, "") + "\n")
  }
  console.warn = function(): void {
    process.stdout.write(format.apply(this, arguments) + '\n')
    write((format.apply(this, arguments))
      .replace(/\u001b\[.*?m/g, "") + "\n")
  }
  console.debug = function(): void {
    process.stdout.write(format.apply(this, arguments) + '\n')
    write((format.apply(this, arguments))
      .replace(/\u001b\[.*?m/g, "") + "\n")
  }
  console.error = function(): void {
    process.stderr.write(format.apply(this, arguments) + '\n')
    write((format.apply(this, arguments))
      .replace(/\u001b\[.*?m/g, "") + "\n")
  }

}
export function logLogo(): void {
  console.log(chalk.hex('#6990ff')(`
           ______        ______  ______
          (____  \\      (_____ \\(_____ \\
           ____)  )_____ _____) )_____) )
          |  __  (| ___ |  __  /|  ____/
          | |__)  ) ____| |  \\ \\| |
          |______/|_____)_|   |_|_|

  `))
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function applyMixinsToClass(derivedCtor: any, ...baseCtors: any[]): void {
  for (const ctor of baseCtors) {
    for (const name of  Object.getOwnPropertyNames(ctor.prototype)) {
      if (name !== 'constructor') {
        derivedCtor.prototype[name] = ctor.prototype[name]
      }
    }
  }
}
export function stripFormat(s: string): string {
  return s.replace(/\u001b\[.*?m/g, "")
}
