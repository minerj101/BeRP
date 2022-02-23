import {
  AccountInfo,
  AuthenticationResult,
} from "@azure/msal-node"
import { BeRP } from "../"
import { Logger } from '../../console'
import * as C from '../../Constants'
import { ConnectionHandler } from "./"

export class ConnectionManager {
  private _berp: BeRP
  private _logger: Logger
  private _connections = new Map<number, ConnectionHandler>()

  private _account: AccountInfo
  private _accountAuthRes: AuthenticationResult
  private _accountAuthRefresh: NodeJS.Timer
  constructor(account: AccountInfo, berp: BeRP) {
    this._berp = berp
    this._account = account
    this._logger = new Logger(`Connection Manager (${account.username})`, "#ff9169")
    this._startAuthRefresh()
    this._logger.success("Initialized")
  }

  public getConnections(): Map<number, ConnectionHandler> { return this._connections }

  public getAccount(): AccountInfo { return this._account }
  public getLogger(): Logger { return this._logger }

  private _startAuthRefresh(): void {
    this._accountAuthRefresh = setInterval(async () => {
      await this._authRefresh()
    }, 1000 * 60 * 60 * 12) // every 12 hours
  }

  private async _authRefresh(): Promise<void> {
    try {
      const res = await this._berp.getAuthProvider().aquireTokenFromCache({
        scopes: C.Scopes,
        account: this._account,
      })

      this._accountAuthRes = res
    } catch (error) {
      this._logger.error(`Failed to refresh auth flow for "${this._account.username}". Terminating all connections and removing account from cache. Please reauth!\n`, error)
      this._berp.getAuthProvider().getCache()
        .removeAccount(this._account)
    }
  }


}
