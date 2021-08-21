import {
  Method,
} from 'axios'
export type LoggerColors = (
  "black" |
  "blackBright" |
  "red" |
  "redBright" |
  "green" |
  "greenBright" |
  "yellow" |
  "yellowBright" |
  "blue" |
  "blueBright" |
  "magenta" |
  "magentaBright" |
  "cyan" |
  "cyanBright" |
  "white" |
  "whiteBright" |
  "gray" |
  "grey" 
)

export interface ConsoleCommand {
  name: string
  description: string
  usage: string
  aliases: string[]
  new(berp)
  execute(argv: string[]): void
}

export interface MCHeaders {
  "cache-control": string
  "Accept": string
  "Accept-Encoding": string
  "Accept-Language": string
  "content-type": string
  "charset": string
  "client-version": string
  "authorization": string
  "Connection": string
  "Host": string
  "User-Agent": string
}

export type DataProviderKnownFiles = (
  "protocol.json" |
  "steve.json" |
  "steveGeometry.json" |
  "steveSkin.bin"
)

export interface AuthHandlerOptions {
  clientId: string
  authority: string
  cacheDir: string
}
export interface AuthHandlerXSTSResponse {
  name: string
  // xuid: string
  hash: string
  token: string
  expires: string
}
export interface XboxProfileExtraData {
  XUID: string
  identity: string
  displayName: string
  titleId: number
}
export interface XboxProfile {
  nbf: number
  extraData: XboxProfileExtraData
  randomNonce: number
  iss: string
  exp: number
  iat: number
  identityPublicKey: string
}

export interface RequestParams {
  method: Method
  url: string
  headers?: Record<string, any>
  body?: Record<string, any>
}
export interface RequestOptions {
  attempts?: number
  attemptTimeout?: number
  requestTimeout?: number
}

export interface RealmAPIJoinInfo {
  address: string
  pendingUpdate: boolean
}

export interface RealmAPIWorldsRes {
  servers: RealmAPIWorld[]
}
export interface RealmAPIWorld {
  id: number
  remoteSubscriptionId: string
  owner: string
  ownerUUID: string
  name: string
  motd: string
  defaultPermission: string
  state: string
  daysLeft: number
  expired: boolean
  expiredTrial: boolean
  gracePeriod: boolean
  worldType: string
  players: unknown
  maxPlayers: number
  minigameName: string
  minigameId: unknown
  minigameImage: unknown
  activeSlot: number
  slots: unknown
  member: boolean
  clubId: number
  subscriptionRefreshStatus: unknown
}

export interface examplePlugin {
  new (pluginApi: any)
  onEnabled(): Promise<void>
  onDisabled(): Promise<void>
}

export interface examplePluginConfig {
  name: string
  displayName: string
  version: string
  description: string
  devMode: boolean
  main: string
  scripts: {
    build: string
    dev: string
    start: string
    [key: string]: string
  }
  author: string
  license: string
  dependencies: {
    [key: string]: string
  }
  devDependencies: {
    [key: string]: string
  }
  [key: string]: unknown
}