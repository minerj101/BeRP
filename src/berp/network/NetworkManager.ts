import { Logger } from "../../console"
import { BeRP } from ".."
import { ConnectionManager } from "./ConnectionManager"

export class NetworkManager {
  private _berp: BeRP
  private _accounts = new Map<string, ConnectionManager>()
  private _logger = new Logger("Network Manager")
  constructor(berp: BeRP) {
    this._berp = berp

    this._logger.success("Initialized")
  }
  public getAccounts(): Map<string, ConnectionManager> { return this._accounts }
  public getLogger(): Logger { return this._logger }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public create(accountInfo) {
    if (!this._accounts.get(accountInfo.username)) {
      const con = new ConnectionManager(accountInfo, this._berp)
      this._accounts.set(accountInfo.username,con)
      return con
    }
  }

}
