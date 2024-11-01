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
 * @category RemoveUserFromWhitelist
 * @category generated
 */
export const removeUserFromWhitelistStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'RemoveUserFromWhitelistInstructionArgs'
)
/**
 * Accounts required by the _removeUserFromWhitelist_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] pair
 * @property [_writable_] whitelistedUserInfo
 * @category Instructions
 * @category RemoveUserFromWhitelist
 * @category generated
 */
export type RemoveUserFromWhitelistInstructionAccounts = {
  authority: web3.PublicKey
  pair: web3.PublicKey
  whitelistedUserInfo: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const removeUserFromWhitelistInstructionDiscriminator = [
  198, 73, 139, 218, 243, 209, 180, 182,
]

/**
 * Creates a _RemoveUserFromWhitelist_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RemoveUserFromWhitelist
 * @category generated
 */
export function createRemoveUserFromWhitelistInstruction(
  accounts: RemoveUserFromWhitelistInstructionAccounts,
  programId = new web3.PublicKey('JDe51ZjpQ3tZzL6QTVPHt5VT5NzaDuJnrTmJJUFrC3vm')
) {
  const [data] = removeUserFromWhitelistStruct.serialize({
    instructionDiscriminator: removeUserFromWhitelistInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.pair,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.whitelistedUserInfo,
      isWritable: true,
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
