import { resolve } from 'path';

import { BeRP } from './berp';
import { createXBLToken } from './berp/utils';
import * as C from './Constants';
import { RealmAPIJoinInfo, RealmAPIWorldsRes } from './types/berp';
import { overrideProcessConsole } from './utils';

overrideProcessConsole(resolve(process.cwd(), 'logs'))

const Berp = new BeRP()


const execute = async (): Promise<void> => {
  const accounts = await Berp
    .getAuthProvider()
    .getCache()
    .getAllAccounts()

  if (!accounts.length) return Berp.getCommandHandler().error("There are no active accounts linked to BeRP! Please use \"account add\" to link a new account!")

  Berp.getConsole()
    .sendSelectPrompt("Select which account you would like to use", accounts.map(a => `${a.name} (${a.username})`))
    .then(async (r) => {
      if (r) {
        try {
          const username = /\(.*\)/.exec(r)[0].replace(/(\(|\))/g, "")
          const account = accounts.find(a => a.username === username)
          if (!account) {
            return Berp.getNetworkManager().getLogger()
              .error(`Failed to select account "${username}"`)
          }

          const authRes = await Berp.getAuthProvider().aquireTokenFromCache({
            scopes: C.Scopes,
            account,
          })
          const xsts = await Berp.getAuthProvider().ezXSTSForRealmAPI(authRes)

          let net = Berp.getNetworkManager().getAccounts()
            .get(account.username)
          if (!net) {
            net = Berp.getNetworkManager().create(account)
          }
          const curRealms = Array.from(net.getConnections().keys())

          const req = new Berp.Request({
            method: "GET",
            url: C.Endpoints.RealmAPI.GET.Realms,
            headers: C.RealmAPIHeaders(createXBLToken(xsts)),
          }, {
            requestTimeout: 50000,
            attemptTimeout: 300,
            attempts: 20,

          })
          req.onFufilled = (res: RealmAPIWorldsRes) => {
            if (!res.servers || !res.servers.length) return net.getLogger().error(`No realms could be found under the account "${account.username}"`)
            Berp.getConsole()
              .sendSelectPrompt("Select which realm you would like to connect to", res.servers.filter(i => !i.expired && !curRealms.includes(i.id)).map(a => `${a.name.replace(/§\S/g, "")} (${a.id})`))
              .then(async (r) => {
                if (r) {
                  try {
                    const id = /\(.*\)/.exec(r)[0].replace(/(\(|\))/g, "")
                    const realm = res.servers.find(r => r.id === parseInt(id.replace(new RegExp(/\D/gm, 'g'), '')))
                    if (!realm) {
                      return Berp.getNetworkManager().getLogger()
                        .error(`Failed to select realm`)
                    }

                    console.log(createXBLToken(xsts))

                    const req = new Berp.Request({
                      method: "GET",
                      url: C.Endpoints.RealmAPI.GET.RealmJoinInfo(realm.id),
                      headers: C.RealmAPIHeaders(createXBLToken(xsts)),
                    }, {
                      requestTimeout: 50000,
                      attemptTimeout: 300,
                      attempts: 100,
                    })
                    req.onFufilled = (res: RealmAPIJoinInfo) => {
                      const split = res.address.split(":")
                      const ip = split[0]
                      const port = parseInt(split[1])
                      console.log(ip, port, realm)
                    }
                    req.onFailed = () => {
                      return net.getLogger().error(`Failed to get join info for realm "${realm.name}"`)
                    }
                    Berp.getSequentialBucket().addRequest(req)
                  } catch (error) {
                    Berp.getNetworkManager().getLogger()
                      .error(`Failed to select account for realm connection...\n`, error)
                  }
                } else {
                  Berp.getCommandHandler().error("Connection process canceled!")
                }
              })
          }
          req.onFailed = () => {
            return net.getLogger()
              .error(`Failed to select account for realm connection...`)
          }
          Berp.getSequentialBucket().addRequest(req)
        } catch (error) {
          Berp.getNetworkManager().getLogger()
            .error(`Failed to select account for realm connection...\n`, error)
        }
      } else {
        Berp.getCommandHandler().error("Connection process canceled!")
      }
    })
}
execute()
