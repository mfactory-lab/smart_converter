import { web3 } from '@coral-xyz/anchor'
import log from 'loglevel'
import { useContext } from '../context'

type WhitelistOpts = {
  userWallet: string
  tokenA: string
  tokenB: string
}

export async function addUserToWhitelist(opts: WhitelistOpts) {
  const { client, cluster } = useContext()

  try {
    const { signature, user } = await client.addUserToWhitelist({
      tokenA: new web3.PublicKey(opts.tokenA),
      tokenB: new web3.PublicKey(opts.tokenB),
      userWallet: new web3.PublicKey(opts.userWallet),
    })
    log.info(`Signature: ${signature}`)
    log.info(`User: ${user}`)
    log.info(`See available pairs: "pnpm cli -c ${cluster} user show-available ${opts.userWallet}"`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function removeUserFromWhitelist(opts: WhitelistOpts) {
  const { client } = useContext()

  try {
    const { signature, user } = await client.removeUserFromWhitelist({
      tokenA: new web3.PublicKey(opts.tokenA),
      tokenB: new web3.PublicKey(opts.tokenB),
      userWallet: new web3.PublicKey(opts.userWallet),
    })

    log.info(`Signature: ${signature}`)
    log.info(`User: ${user}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function blockUser(wallet: string) {
  const { client } = useContext()

  try {
    const { signature, user } = await client.blockUser({
      userWallet: new web3.PublicKey(wallet),
    })

    log.info(`Signature: ${signature}`)
    log.info(`User: ${user}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function unblockUser(wallet: string) {
  const { client } = useContext()

  try {
    const { signature, user } = await client.unblockUser({
      userWallet: new web3.PublicKey(wallet),
    })
    log.info(`Signature: ${signature}`)
    log.info(`User: ${user}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function showUserInfo(address: string) {
  const { client, cluster } = useContext()

  const user = new web3.PublicKey(address)
  const userData = await client.fetchUser(user)

  log.info('--------------------------------------------------------------------------')
  log.info(`User: ${user}`)
  log.info(`User wallet: ${userData.authority}`)
  log.info(`Is user blocked: ${userData.isBlocked}`)
  log.info(`See available pairs: "pnpm cli -c ${cluster} user show-available ${userData.authority}"`)
  log.info('--------------------------------------------------------------------------')
}

export async function findUserInfo(wallet: string) {
  const { client, cluster } = useContext()

  const [user] = client.pda.user(wallet)
  const userData = await client.fetchUser(user)

  log.info('--------------------------------------------------------------------------')
  log.info(`User: ${user}`)
  log.info(`User wallet: ${userData.authority}`)
  log.info(`Is user blocked: ${userData.isBlocked}`)
  log.info(`See available pairs: "pnpm cli -c ${cluster} user show-available ${userData.authority}"`)
  log.info('--------------------------------------------------------------------------')
}

export async function showAvailablePairs(wallet: string) {
  const { client, cluster } = useContext()

  const userWallet = new web3.PublicKey(wallet)
  const accounts = await client.findUserWhitelistInfos(new web3.PublicKey(userWallet))
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`Pair address: ${account.account.pair}`)
    log.info(`See all info: "pnpm cli -c ${cluster} pair show ${account.account.pair}"`)
  }
  log.info('--------------------------------------------------------------------------')
}
