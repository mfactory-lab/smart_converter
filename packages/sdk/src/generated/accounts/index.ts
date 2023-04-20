import { Admin } from './Admin'
import { Manager } from './Manager'
import { User } from './User'
import { WhitelistedUserInfo } from './WhitelistedUserInfo'
import { Pair } from './Pair'

export * from './Admin'
export * from './Manager'
export * from './Pair'
export * from './User'
export * from './WhitelistedUserInfo'

export const accountProviders = {
  Admin,
  Manager,
  User,
  WhitelistedUserInfo,
  Pair,
}
