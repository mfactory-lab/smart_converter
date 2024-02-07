import { BN } from '@coral-xyz/anchor'
import log from 'loglevel'
import { PublicKey } from '@solana/web3.js'
import { useContext } from '../context'

export async function addPair(opts: AddPairOpts) {
  const { client } = useContext()

  try {
    const { pair, signature } = await client.addPair({
      ratio: { num: new BN(opts.num), denom: new BN(opts.denom) },
      tokenA: new PublicKey(opts.tokenA),
      tokenB: opts.tokenB ? new PublicKey(opts.tokenB) : undefined,
      policy: opts.policy ? new PublicKey(opts.policy) : undefined,
    })

    log.info(`Signature: ${signature}`)
    log.info(`Pair: ${pair}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function removePair(opts: RemovePairOpts) {
  const { client } = useContext()

  try {
    const { signature } = await client.removePair({
      tokenA: new PublicKey(opts.tokenA),
      tokenB: new PublicKey(opts.tokenB),
    })
    log.info(`Signature: ${signature}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function updatePair(opts: UpdatePairOpts) {
  const { client } = useContext()

  let managerWallet
  if (opts.managerWallet !== undefined) {
    managerWallet = new PublicKey(opts.managerWallet)
  }
  let feeReceiver
  if (opts.feeReceiver !== undefined) {
    feeReceiver = new PublicKey(opts.feeReceiver)
  }
  let ratio
  if (opts.num !== undefined && opts.denom !== undefined) {
    const num = new BN(opts.num)
    const denom = new BN(opts.denom)
    ratio = { num, denom }
  }
  let isPaused
  if (opts.isPaused !== undefined) {
    isPaused = opts.isPaused.includes('true')
  }

  try {
    const { signature, pair } = await client.updatePair({
      tokenA: new PublicKey(opts.tokenA),
      tokenB: new PublicKey(opts.tokenB),
      newAuthority: managerWallet,
      feeReceiver,
      lockFee: opts.lockFee,
      unlockFee: opts.unlockFee,
      ratio,
      isPaused,
    })

    log.info(`Signature: ${signature}`)
    log.info(`Pair: ${pair}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function withdrawFee(opts: WithdrawFeeOpts) {
  const { client } = useContext()

  try {
    const { signature } = await client.withdrawFee({
      amount: new BN(opts.amount),
      destination: new PublicKey(opts.destination),
      tokenA: new PublicKey(opts.tokenA),
      tokenB: new PublicKey(opts.tokenB),
    })

    log.info(`Signature: ${signature}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function showPairInfo(address: string) {
  const { client, cluster } = useContext()

  const pair = new PublicKey(address)
  const pairData = await client.fetchPair(pair)
  const [pairAuthority] = client.pda.pairAuthority(pair)
  const feeBalance = await client.provider.connection.getBalance(pairAuthority)

  log.info('--------------------------------------------------------------------------')
  log.info(`Pair: ${pair}`)
  log.info(`Token A: ${pairData.tokenA} - TokenB: ${pairData.tokenB}`)
  log.info(`Ratio: ${pairData.ratio.num}/${pairData.ratio.denom}`)
  log.info(`Manager wallet: ${pairData.authority}`)
  log.info(`Fee receiver: ${pairData.feeReceiver}`)
  log.info(`Is pair paused: ${pairData.isPaused}`)
  log.info(`Locked amount: ${pairData.lockedAmount}`)
  log.info(`Lock fee (in .%): ${pairData.lockFee}`)
  log.info(`Unlock fee (in .%): ${pairData.unlockFee}`)
  log.info(`Fee balance: ${feeBalance}`)
  log.info(`See whitelisted users: "pnpm cli -c ${cluster} pair show-users ${pair}"`)
  log.info('--------------------------------------------------------------------------')
}

export async function findPairInfo(tokenA: string, tokenB: string) {
  const { client, cluster } = useContext()

  const [pair] = client.pda.pair(new PublicKey(tokenA), new PublicKey(tokenB))
  const [pairAuthority] = client.pda.pairAuthority(pair)
  const feeBalance = await client.provider.connection.getBalance(pairAuthority)

  const pairData = await client.fetchPair(pair)

  log.info('--------------------------------------------------------------------------')
  log.info(`Pair: ${pair}`)
  log.info(`Token A: ${pairData.tokenA} - TokenB: ${pairData.tokenB}`)
  log.info(`Ratio: ${pairData.ratio.num}/${pairData.ratio.denom}`)
  log.info(`Manager wallet: ${pairData.authority}`)
  log.info(`Fee receiver: ${pairData.feeReceiver}`)
  log.info(`Is pair paused: ${pairData.isPaused}`)
  log.info(`Locked amount: ${pairData.lockedAmount}`)
  log.info(`Lock fee (in .%): ${pairData.lockFee}`)
  log.info(`Unlock fee (in .%): ${pairData.unlockFee}`)
  log.info(`Fee balance: ${feeBalance}`)
  log.info(`See whitelisted users: "pnpm cli -c ${cluster} pair show-users ${pair}"`)
  log.info('--------------------------------------------------------------------------')
}

export async function showAllPairs() {
  const { client, cluster } = useContext()

  const accounts = await client.findPairs()
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`Pair address: ${account.publicKey}`)
    log.info(`Token A: ${account.account.tokenA} - TokenB: ${account.account.tokenB}`)
    log.info(`Is pair paused: ${account.account.isPaused}`)
    log.info(`See all info: "pnpm cli -c ${cluster} pair show ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}

export async function showWhitelistedUsers(address: string) {
  const { client, cluster } = useContext()

  const accounts = await client.findWhitelistedUsers(new PublicKey(address))
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`User address: ${account.publicKey}`)
    log.info(`See all info: "pnpm cli -c ${cluster} user show ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}

type AddPairOpts = {
  num: string
  denom: string
  tokenA: string
  tokenB?: string
  policy?: string
}

type RemovePairOpts = {
  tokenA: string
  tokenB: string
}

type UpdatePairOpts = {
  tokenA: string
  tokenB: string
  managerWallet?: string
  isPaused?: string
  num?: number
  denom?: number
  feeReceiver?: string
  lockFee?: number
  unlockFee?: number
}

type WithdrawFeeOpts = {
  tokenA: string
  tokenB: string
  amount: string
  destination: string
}
