import { BN, web3 } from '@coral-xyz/anchor'
import log from 'loglevel'
import { getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from '@solana/spl-token'
import { useContext } from '../context'

type Opts = {
  tokenA: string
  tokenB: string
  amount: string
  feePayer?: string
}

export async function lockTokens(opts: Opts) {
  const { provider, client, keypair } = useContext()

  const tokenA = new web3.PublicKey(opts.tokenA)
  const tokenB = new web3.PublicKey(opts.tokenB)
  const [pair] = client.pda.pair(tokenA, tokenB)
  const [pairAuthority] = client.pda.pairAuthority(pair)

  let feePayer
  if (opts.feePayer !== undefined) {
    feePayer = new web3.PublicKey(opts.feePayer)
  }

  const sourceA = await getAssociatedTokenAddress(tokenA, provider.wallet.publicKey)
  const destinationA = await getAssociatedTokenAddress(tokenA, pairAuthority, true)
  const destinationB = (await getOrCreateAssociatedTokenAccount(provider.connection, keypair, tokenB, provider.wallet.publicKey)).address

  try {
    const { signature } = await client.lockTokens({
      amount: new BN(opts.amount),
      destinationA,
      destinationB,
      feePayer,
      sourceA,
      tokenA,
      tokenB,
    })
    log.info(`Signature: ${signature}`)
    log.info(`Pair: ${pair}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function unlockTokens(opts: Opts) {
  const { provider, client } = useContext()

  const tokenA = new web3.PublicKey(opts.tokenA)
  const tokenB = new web3.PublicKey(opts.tokenB)
  const [pair] = client.pda.pair(tokenA, tokenB)
  const [pairAuthority] = client.pda.pairAuthority(pair)

  let feePayer
  if (opts.feePayer !== undefined) {
    feePayer = new web3.PublicKey(opts.feePayer)
  }

  const sourceA = await getAssociatedTokenAddress(tokenA, pairAuthority, true)
  const destinationA = await getAssociatedTokenAddress(tokenA, provider.wallet.publicKey)
  const sourceB = await getAssociatedTokenAddress(tokenB, provider.wallet.publicKey)

  try {
    const { signature } = await client.unlockTokens({
      amount: new BN(opts.amount),
      destinationA,
      sourceB,
      feePayer,
      sourceA,
      tokenA,
      tokenB,
    })

    log.info(`Signature: ${signature}`)
    log.info(`Pair: ${pair}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}
