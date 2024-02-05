export * from './Admin'
export * from './Manager'
export * from './Pair'
export * from './User'
export * from './WhitelistedUserInfo'

import { Pair } from './Pair'
import { Admin } from './Admin'
import { Manager } from './Manager'
import { User } from './User'
import { WhitelistedUserInfo } from './WhitelistedUserInfo'

export const accountProviders = {
  Pair,
  Admin,
  Manager,
  User,
  WhitelistedUserInfo,
}
