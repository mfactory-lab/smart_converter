/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category UnlockTokens
 * @category generated
 */
export interface UnlockTokensInstructionArgs {
  amount: beet.bignum
}
/**
 * @category Instructions
 * @category UnlockTokens
 * @category generated
 */
export const unlockTokensStruct = new beet.BeetArgsStruct<
  UnlockTokensInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
  ],
  'UnlockTokensInstructionArgs',
)
/**
 * Accounts required by the _unlockTokens_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] user
 * @property [_writable_] pair
 * @property [] manager
 * @property [] admin
 * @property [] pairAuthority
 * @property [] managerWallet
 * @property [_writable_] tokenA
 * @property [_writable_] tokenB
 * @property [_writable_] sourceA
 * @property [_writable_] destinationA
 * @property [_writable_] sourceB
 * @property [] clock
 * @category Instructions
 * @category UnlockTokens
 * @category generated
 */
export interface UnlockTokensInstructionAccounts {
  authority: web3.PublicKey
  user: web3.PublicKey
  pair: web3.PublicKey
  manager: web3.PublicKey
  admin: web3.PublicKey
  pairAuthority: web3.PublicKey
  managerWallet: web3.PublicKey
  tokenA: web3.PublicKey
  tokenB: web3.PublicKey
  sourceA: web3.PublicKey
  destinationA: web3.PublicKey
  sourceB: web3.PublicKey
  clock: web3.PublicKey
  tokenProgram?: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const unlockTokensInstructionDiscriminator = [
  233, 35, 95, 159, 37, 185, 47, 88,
]

/**
 * Creates a _UnlockTokens_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category UnlockTokens
 * @category generated
 */
export function createUnlockTokensInstruction(
  accounts: UnlockTokensInstructionAccounts,
  args: UnlockTokensInstructionArgs,
  programId = new web3.PublicKey('BSP9GP7vACnCKxEXdqsDpGdnqMBafc6rtQozGwRkKqKH'),
) {
  const [data] = unlockTokensStruct.serialize({
    instructionDiscriminator: unlockTokensInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.user,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.pair,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.manager,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.pairAuthority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.managerWallet,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenA,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenB,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.sourceA,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.destinationA,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.sourceB,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.clock,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
