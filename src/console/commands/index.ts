/* eslint-disable @typescript-eslint/no-unused-vars */
import { BeRP } from "../../berp"
import { Help } from './help'
import { Account } from './account'
import { Connect } from './connect'

class ex {
  public name: string
  public description: string
  public usage: string
  public aliases: string[]
  constructor(berp: BeRP) { /**/ }
  public execute(argv: string[]): void { /* */ }
}

const Commands: typeof ex[] = [
  Help,
  Account,
  Connect,
]

export { Commands }
