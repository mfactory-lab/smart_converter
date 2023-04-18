/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category UnblockUser
 * @category generated
 */
export const unblockUserStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'UnblockUserInstructionArgs',
)
/**
 * Accounts required by the _unblockUser_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] manager
 * @property [_writable_] user
 * @property [] userWallet
 * @category Instructions
 * @category UnblockUser
 * @category generated
 */
export interface UnblockUserInstructionAccounts {
  authority: web3.PublicKey
  manager: web3.PublicKey
  user: web3.PublicKey
  userWallet: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const unblockUserInstructionDiscriminator = [
  216, 208, 128, 98, 74, 210, 18, 114,
]

/**
 * Creates a _UnblockUser_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category UnblockUser
 * @category generated
 */
export function createUnblockUserInstruction(
  accounts: UnblockUserInstructionAccounts,
  programId = new web3.PublicKey('BSP9GP7vACnCKxEXdqsDpGdnqMBafc6rtQozGwRkKqKH'),
) {
  const [data] = unblockUserStruct.serialize({
    instructionDiscriminator: unblockUserInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.manager,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.user,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userWallet,
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
