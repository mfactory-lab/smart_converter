import { Buffer } from 'buffer'
import fs from 'fs'
import { SmartConverterClient } from '@smart-converter/sdk'
import { AnchorProvider, Program, Wallet, web3 } from '@project-serum/anchor'
import type { Cluster } from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import { clusterUrl } from './utils'

export interface Context {
  cluster: Cluster | string
  provider: AnchorProvider
  client: SmartConverterClient
  keypair: Keypair
}

const context: Context = {
  cluster: 'devnet',
  // @ts-expect-error ...
  provider: undefined,
  // @ts-expect-error ...
  client: undefined,
}

export function initContext({ cluster, keypair }: { cluster: Cluster; keypair: string }) {
  const opts = AnchorProvider.defaultOptions()
  const endpoint = cluster.startsWith('http') ? cluster : clusterUrl(cluster)
  const connection = new web3.Connection(endpoint, opts.commitment)
  const walletKeypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(fs.readFileSync(keypair).toString())))
  const wallet = new Wallet(walletKeypair)

  context.cluster = cluster
  context.provider = new AnchorProvider(connection, wallet, opts)
  context.client = new SmartConverterClient({
    program: new Program(SmartConverterClient.IDL, SmartConverterClient.programId, context.provider),
    wallet: context.provider.wallet,
  })
  context.keypair = walletKeypair

  return context
}

export function useContext() {
  return context
}
