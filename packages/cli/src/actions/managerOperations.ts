import { web3 } from '@project-serum/anchor'
import log from 'loglevel'
import { useContext } from '../context'

interface Opts {
  managerWallet: string
}

export async function addManager(opts: Opts) {
  const { provider, client } = useContext()

  const { tx, manager } = await client.addManager({
    managerWallet: new web3.PublicKey(opts.managerWallet),
  })

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Manager: ${manager}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function removeManager(opts: Opts) {
  const { provider, client } = useContext()

  const { tx } = await client.removeManager({
    managerWallet: new web3.PublicKey(opts.managerWallet),
  })

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function pausePairs(opts: Opts) {
  const { provider, client } = useContext()

  const { tx, manager } = await client.pausePairs({
    managerWallet: new web3.PublicKey(opts.managerWallet),
  })

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Manager: ${manager}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function resumePairs(opts: Opts) {
  const { provider, client } = useContext()

  const { tx, manager } = await client.resumePairs({
    managerWallet: new web3.PublicKey(opts.managerWallet),
  })

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Manager: ${manager}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function showManagerInfo(address: string) {
  const { client, cluster } = useContext()

  const manager = new web3.PublicKey(address)
  const managerData = await client.fetchManager(manager)

  log.info('--------------------------------------------------------------------------')
  log.info(`Manager: ${manager}`)
  log.info(`Manager wallet: ${managerData.authority}`)
  log.info(`Is all manager's pairs paused: ${managerData.isAllPaused}`)
  log.info(`See manager's pairs: "pnpm cli -c ${cluster} manager show-pairs ${address}"`)
  log.info('--------------------------------------------------------------------------')
}

export async function findManagerInfo(wallet: string) {
  const { client, cluster } = useContext()

  const [manager] = await client.pda.manager(new web3.PublicKey(wallet))
  const managerData = await client.fetchManager(manager)

  log.info('--------------------------------------------------------------------------')
  log.info(`Manager: ${manager}`)
  log.info(`Manager wallet: ${managerData.authority}`)
  log.info(`Is all manager's pairs paused: ${managerData.isAllPaused}`)
  log.info(`See manager's pairs: "pnpm cli -c ${cluster} manager show-pairs ${manager}"`)
  log.info('--------------------------------------------------------------------------')
}

export async function showAllManagers() {
  const { client, cluster } = useContext()

  const accounts = await client.findManagers()
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`Manager address: ${account.publicKey}`)
    log.info(`Manager wallet: ${account.account.authority}`)
    log.info(`Is all manager's pairs paused: ${account.account.isAllPaused}`)
    log.info(`See manager's pairs: "pnpm cli -c ${cluster} manager show-pairs ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}

export async function showManagerPairs(address: string) {
  const { client, cluster } = useContext()

  const accounts = await client.findManagerPairs(new web3.PublicKey(address))
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`Pair address: ${account.publicKey}`)
    log.info(`Token A: ${account.account.tokenA} - TokenB: ${account.account.tokenB}`)
    log.info(`See all info: "pnpm cli -c ${cluster} pair show ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}
