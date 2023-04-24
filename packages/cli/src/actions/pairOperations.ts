import { BN, web3 } from '@project-serum/anchor'
import log from 'loglevel'
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token'
import { useContext } from '../context'

interface AddPairOpts {
  num: string
  denom: string
  tokenA: string
  tokenB: string
}

interface RemovePairOpts {
  tokenA: string
  tokenB: string
}

interface UpdatePairOpts {
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

interface WithdrawFeeOpts {
  tokenA: string
  tokenB: string
  amount: string
  destination: string
}

export async function addPair(opts: AddPairOpts) {
  const { provider, client, keypair } = useContext()

  const num = new BN(opts.num)
  const denom = new BN(opts.denom)
  const tokenA = new web3.PublicKey(opts.tokenA)
  const tokenB = new web3.PublicKey(opts.tokenB)

  const [pair] = await client.pda.pair(tokenA, tokenB)
  const [pairAuthority] = await client.pda.pairAuthority(pair)
  await getOrCreateAssociatedTokenAccount(provider.connection, keypair, tokenA, pairAuthority, true)

  const { tx } = await client.addPair({
    ratio: { num, denom },
    tokenA,
    tokenB,
  })

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Pair: ${pair}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function removePair(opts: RemovePairOpts) {
  const { provider, client } = useContext()

  const { tx } = await client.removePair({
    tokenA: new web3.PublicKey(opts.tokenA),
    tokenB: new web3.PublicKey(opts.tokenB),
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

export async function updatePair(opts: UpdatePairOpts) {
  const { provider, client } = useContext()

  let managerWallet
  if (opts.managerWallet !== undefined) {
    managerWallet = new web3.PublicKey(opts.managerWallet)
  }
  let feeReceiver
  if (opts.feeReceiver !== undefined) {
    feeReceiver = new web3.PublicKey(opts.feeReceiver)
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

  const { tx, pair } = await client.updatePair({
    tokenA: new web3.PublicKey(opts.tokenA),
    tokenB: new web3.PublicKey(opts.tokenB),
    managerWallet,
    feeReceiver,
    lockFee: opts.lockFee,
    unlockFee: opts.unlockFee,
    ratio,
    isPaused,
  })

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Pair: ${pair}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function withdrawFee(opts: WithdrawFeeOpts) {
  const { provider, client } = useContext()

  const { tx } = await client.withdrawFee({
    amount: new BN(opts.amount),
    destination: new web3.PublicKey(opts.destination),
    tokenA: new web3.PublicKey(opts.tokenA),
    tokenB: new web3.PublicKey(opts.tokenB),
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

export async function showPairInfo(address: string) {
  const { client, provider, cluster } = useContext()

  const pair = new web3.PublicKey(address)
  const pairData = await client.fetchPair(pair)
  const [pairAuthority] = await client.pda.pairAuthority(pair)
  const feeBalance = await provider.connection.getBalance(pairAuthority)

  log.info('--------------------------------------------------------------------------')
  log.info(`Pair: ${pair}`)
  log.info(`Token A: ${pairData.tokenA} - TokenB: ${pairData.tokenB}`)
  log.info(`Ratio: ${pairData.ratio.num}/${pairData.ratio.denom}`)
  log.info(`Manager wallet: ${pairData.managerWallet}`)
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
  const { client, provider, cluster } = useContext()

  const [pair] = await client.pda.pair(new web3.PublicKey(tokenA), new web3.PublicKey(tokenB))
  const pairData = await client.fetchPair(pair)
  const [pairAuthority] = await client.pda.pairAuthority(pair)
  const feeBalance = await provider.connection.getBalance(pairAuthority)

  log.info('--------------------------------------------------------------------------')
  log.info(`Pair: ${pair}`)
  log.info(`Token A: ${pairData.tokenA} - TokenB: ${pairData.tokenB}`)
  log.info(`Ratio: ${pairData.ratio.num}/${pairData.ratio.denom}`)
  log.info(`Manager wallet: ${pairData.managerWallet}`)
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

  const accounts = await client.findWhitelistedUsers(new web3.PublicKey(address))
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`User address: ${account.publicKey}`)
    log.info(`See all info: "pnpm cli -c ${cluster} user show ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}
