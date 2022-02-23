
import { Logger } from '../../console'
import { ConnectionManager } from "./ConnectionManager"
import {
  ActivePlugin,
  RealmAPIWorld,
} from "src/types/berp"
import { BeRP } from ".."
// TODO: Client/plugins can control connection/diconnection of rak


export class ConnectionHandler {
  public static readonly KEEPALIVEINT = 10
  public readonly host: string
  public readonly port: number
  public readonly realm: RealmAPIWorld
  private _tickSync = 0n
  private _tickSyncKeepAlive: NodeJS.Timer
  private _connectionManager: ConnectionManager
  private _log: Logger
  private _plugins = new Map<string, ActivePlugin>()
  private _berp: BeRP
  constructor(host: string, port: number, realm: RealmAPIWorld, cm: ConnectionManager, berp: BeRP) {
    this.host = host
    this.port = port
    this.realm = realm
    this._connectionManager = cm
    this._berp = berp

    this._log = new Logger(`Connection Handler (${cm.getAccount().username}:${realm.id})`, 'cyanBright')

    this._log.success("Initialized")
  }
  public getLogger(): Logger { return this._log }
  public getTick(): bigint { return this._tickSync }
  public getConnectionManager(): ConnectionManager { return this._connectionManager }

  public close(): void {
    this._connectionManager.getConnections().delete(this.realm.id)
  }
}
