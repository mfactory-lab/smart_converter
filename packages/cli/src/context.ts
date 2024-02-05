import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import { SmartConverterClient } from '@smart-converter/sdk'
import type { Cluster } from '@solana/web3.js'
import { Connection, Keypair } from '@solana/web3.js'
import { AnchorProvider } from '@coral-xyz/anchor'
import { clusterUrl } from './utils'

export type Context = {
  cluster: Cluster | string
  provider: AnchorProvider
  client: SmartConverterClient
  keypair: Keypair
}

const context: Context = {
  cluster: 'devnet',
  // @ts-expect-error ...
  client: undefined,
}

export function initContext({ cluster, keypair }: { cluster: Cluster, keypair: string }) {
  const opts = AnchorProvider.defaultOptions()
  const endpoint = cluster.startsWith('http') ? cluster : clusterUrl(cluster)
  const connection = new Connection(endpoint, opts.commitment)
  const walletKeypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(fs.readFileSync(keypair).toString())))

  context.cluster = cluster
  context.client = SmartConverterClient.fromKeypair(connection, walletKeypair)
  context.keypair = walletKeypair

  return context
}

export function useContext() {
  return context
}
