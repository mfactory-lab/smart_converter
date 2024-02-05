import type { AlbusClient } from '@albus-finance/sdk'
import { ProofRequestStatus } from '@albus-finance/sdk'
import { AnchorProvider, Wallet, web3 } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import { assert } from 'vitest'

export function assertErrorCode(error: { logs?: string[] }, code: string) {
  assert.ok(String((error?.logs ?? []).join('')).includes(`Error Code: ${code}`))
}

export async function airdrop(con: Connection, pubkey: PublicKey, amount: number) {
  await con.confirmTransaction(await con.requestAirdrop(pubkey, amount * web3.LAMPORTS_PER_SOL))
}

export function newProvider(payerKeypair: web3.Keypair) {
  const opts = AnchorProvider.defaultOptions()
  return new AnchorProvider(
    new web3.Connection('http://localhost:8899', opts),
    new Wallet(payerKeypair),
    opts,
  )
}

export class AlbusTester {
  constructor(readonly client: AlbusClient, readonly prefix: string = 'test') {
  }

  async createProofRequest(userClient: AlbusClient, status?: ProofRequestStatus) {
    const { address } = await userClient.proofRequest.create({
      serviceCode: `${this.prefix}_test`,
      policyCode: `${this.prefix}_test`,
    })
    await this.client.proofRequest.changeStatus({ proofRequest: address, status: status ?? ProofRequestStatus.Verified })
    return address
  }

  async init() {
    const circuitCode = `${this.prefix}_test`
    const serviceCode = `${this.prefix}_test`
    const policyCode = `${this.prefix}_test`

    const { address: circuit } = await this.client.circuit.create({
      code: circuitCode,
      name: circuitCode,
      wasmUri: '',
      zkeyUri: '',
      outputs: [],
      privateSignals: [],
      publicSignals: [],
    })

    const { address: service } = await this.client.service.create({ code: serviceCode, name: serviceCode })

    const { address: policy } = await this.client.policy.create({
      code: policyCode,
      serviceCode,
      circuitCode,
      name: policyCode,
      description: '',
      expirationPeriod: 0,
      retentionPeriod: 0,
      rules: [],
    })

    return {
      circuit,
      circuitCode,
      service,
      serviceCode,
      policy,
      policyCode,
    }
  }

  async clear() {
    const circuitCode = `${this.prefix}_test`
    const serviceCode = `${this.prefix}_test`
    const policyCode = `${this.prefix}_test`
    await this.client.policy.delete({ serviceCode, code: policyCode })
    await this.client.service.delete({ code: serviceCode })
    await this.client.circuit.delete({ code: circuitCode })
  }
}
