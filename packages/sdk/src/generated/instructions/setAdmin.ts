/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * @category Instructions
 * @category SetAdmin
 * @category generated
 */
export type SetAdminInstructionArgs = {
  key: web3.PublicKey
}
/**
 * @category Instructions
 * @category SetAdmin
 * @category generated
 */
export const setAdminStruct = new beet.BeetArgsStruct<
  SetAdminInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['key', beetSolana.publicKey],
  ],
  'SetAdminInstructionArgs'
)
/**
 * Accounts required by the _setAdmin_ instruction
 *
 * @property [_writable_] admin
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category SetAdmin
 * @category generated
 */
export type SetAdminInstructionAccounts = {
  admin: web3.PublicKey
  authority: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const setAdminInstructionDiscriminator = [
  251, 163, 0, 52, 91, 194, 187, 92,
]

/**
 * Creates a _SetAdmin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetAdmin
 * @category generated
 */
export function createSetAdminInstruction(
  accounts: SetAdminInstructionAccounts,
  args: SetAdminInstructionArgs,
  programId = new web3.PublicKey('JDe51ZjpQ3tZzL6QTVPHt5VT5NzaDuJnrTmJJUFrC3vm')
) {
  const [data] = setAdminStruct.serialize({
    instructionDiscriminator: setAdminInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
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
