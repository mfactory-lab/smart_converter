import { Admin } from './Admin'
import { Manager } from './Manager'
import { User } from './User'
import { Pair } from './Pair'

export * from './Admin'
export * from './Manager'
export * from './Pair'
export * from './User'

export const accountProviders = { Admin, Manager, User, Pair }
