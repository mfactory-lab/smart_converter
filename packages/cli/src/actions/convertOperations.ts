import log from 'loglevel'
import { PublicKey } from '@solana/web3.js'
import { useContext } from '../context'

type Opts = {
  tokenA: string
  tokenB: string
  amount: string
  feePayer?: string
}

export async function lockTokens(opts: Opts) {
  const { client } = useContext()

  const tokenA = new PublicKey(opts.tokenA)
  const tokenB = new PublicKey(opts.tokenB)

  let feePayer
  if (opts.feePayer !== undefined) {
    feePayer = new PublicKey(opts.feePayer)
  }

  try {
    const { pair, signature } = await client.lockTokens({
      amount: Number(opts.amount),
      feePayer,
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
  const { client } = useContext()

  const tokenA = new PublicKey(opts.tokenA)
  const tokenB = new PublicKey(opts.tokenB)

  let feePayer
  if (opts.feePayer !== undefined) {
    feePayer = new PublicKey(opts.feePayer)
  }

  try {
    const { pair, signature } = await client.unlockTokens({
      amount: Number(opts.amount),
      feePayer,
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
