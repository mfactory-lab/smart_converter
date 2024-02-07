import { Buffer } from 'node:buffer'
import type { Address } from '@coral-xyz/anchor'
import type { ConfirmOptions, Connection } from '@solana/web3.js'
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { AnchorProvider, BN, Program, web3 } from '@coral-xyz/anchor'
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  getAccount,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from '@solana/spl-token'
import type { Admin, Manager, Pair, Ratio, User, WhitelistedUserInfo } from './generated'
import {
  PROGRAM_ID,
  createAddManagerInstruction,
  createAddPairInstruction,
  createAddUserToWhitelistInstruction,
  createBlockUserInstruction,
  createLockTokensInstruction,
  createPausePairsInstruction,
  createPausePlatformInstruction,
  createRemoveManagerInstruction,
  createRemovePairInstruction,
  createRemoveUserFromWhitelistInstruction,
  createResumePairsInstruction,
  createResumePlatformInstruction,
  createSetAdminInstruction,
  createUnblockUserInstruction,
  createUnlockTokensInstruction,
  createUpdatePairInstruction,
  createWithdrawFeeInstruction,
} from './generated'
import type { SmartConverter } from './idl/smart_converter'
import { IDL } from './idl/smart_converter'
import { NodeWallet } from './utils'

const USER_SEED_PREFIX = 'user'
const MANAGER_SEED_PREFIX = 'manager'
const PAIR_SEED_PREFIX = 'pair'
const ADMIN_SEED_PREFIX = 'admin'
const WHITELIST_SEED_PREFIX = 'whitelist'

export class SmartConverterClient {
  static programId = PROGRAM_ID

  private program: Program<SmartConverter>

  constructor(readonly provider: AnchorProvider) {
    this.program = new Program<SmartConverter>(IDL, PROGRAM_ID, provider)
  }

  /**
   * Initialize a new `AlbusClient` from the provided {@link wallet}.
   */
  static fromWallet(connection: Connection, wallet?: Wallet, opts?: ConfirmOptions) {
    return new this(new AnchorProvider(
      connection,
      // @ts-expect-error anonymous
      wallet ?? { publicKey: PublicKey.default },
      { ...AnchorProvider.defaultOptions(), ...opts },
    ),
    )
  }

  /**
   * Initialize a new `AlbusClient` from the provided {@link keypair}.
   */
  static fromKeypair(connection: Connection, keypair: Keypair, opts?: ConfirmOptions) {
    return SmartConverterClient.fromWallet(connection, new NodeWallet(keypair), opts)
  }

  get idl(): SmartConverter {
    return this.program.idl
  }

  get pda() {
    return new SmartConverterPDA()
  }

  // Fetch functions
  fetchManager(address: Address) {
    return this.program.account.manager.fetchNullable(address) as unknown as Promise<Manager>
  }

  fetchAdmin(address?: Address) {
    return this.program.account.admin.fetchNullable(address ?? this.pda.admin()[0]) as unknown as Promise<Admin>
  }

  fetchUser(address: Address) {
    return this.program.account.user.fetchNullable(address) as unknown as Promise<User>
  }

  fetchPair(address: Address) {
    return this.program.account.pair.fetchNullable(address) as unknown as Promise<Pair>
  }

  fetchWhitelistedUserInfo(address: Address) {
    return this.program.account.whitelistedUserInfo.fetchNullable(address) as unknown as Promise<WhitelistedUserInfo>
  }

  fetchWhitelistedUserInfoByUserAndPair(user: Address, pair: Address) {
    const [addr] = this.pda.whitelistedUserInfo(user, pair)
    return this.fetchWhitelistedUserInfo(addr)
  }

  findManagers() {
    return this.program.account.manager.all()
  }

  findPairs() {
    return this.program.account.pair.all()
  }

  async findManagerPairs(managerWallet: web3.PublicKey) {
    const accounts = await this.program.account.pair.all()
    // TODO: memcmp filter
    return accounts.filter(a => a.account.authority.toBase58() === managerWallet.toBase58())
  }

  async findWhitelistedUsers(pair: web3.PublicKey) {
    const accounts = await this.program.account.whitelistedUserInfo.all()
    // TODO: memcmp filter
    return accounts.filter(a => a.account.pair.toBase58() === pair.toBase58())
  }

  async findUserWhitelistInfos(userWallet: web3.PublicKey) {
    const accounts = await this.program.account.whitelistedUserInfo.all()
    // TODO: memcmp filter
    return accounts.filter(a => a.account.user.toBase58() === userWallet.toBase58())
  }

  // Functions that construct instructions using pre-generated sdk
  async addManager(props: ManagerProps) {
    const payer = this.provider.publicKey
    const [manager] = this.pda.manager(props.managerWallet)
    const [admin] = this.pda.admin()

    const ix = createAddManagerInstruction(
      {
        authority: payer,
        admin,
        manager,
      },
      {
        key: props.managerWallet,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      manager,
    }
  }

  async addPair(props: AddPairProps) {
    const payer = this.provider.publicKey
    const [manager] = this.pda.manager(payer)
    const tokenA = props.tokenA
    let tokenB = props.tokenB

    const tx = new Transaction()
    const signers = []

    let pair: PublicKey
    let pairAuthority: PublicKey

    if (!tokenB) {
      const keypair = props.tokenBKeypair ?? Keypair.generate()
      tokenB = keypair.publicKey
      signers.push(keypair)

      pair = this.pda.pair(tokenA, tokenB)[0]
      pairAuthority = this.pda.pairAuthority(pair)[0]

      const lamports = await getMinimumBalanceForRentExemptMint(this.provider.connection)

      tx.add(...[
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: keypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(keypair.publicKey, 9, pairAuthority, null, TOKEN_PROGRAM_ID),
      ])
    } else {
      pair = this.pda.pair(tokenA, tokenB)[0]
      pairAuthority = this.pda.pairAuthority(pair)[0]
    }

    await this.handleMissingTokenAccount(tx, tokenA, pairAuthority)
    await this.handleMissingTokenAccount(tx, tokenB, pairAuthority)

    tx.add(createAddPairInstruction(
      {
        authority: payer,
        manager,
        pair,
        pairAuthority,
        tokenA,
        tokenB,
      },
      {
        ratio: props.ratio ?? { num: 1, denom: 1 },
        policy: props.policy ?? null,
      },
    ))

    const signature = await this.provider.sendAndConfirm(tx, signers)

    return {
      signature,
      pair,
    }
  }

  async lockTokens(props: LockTokensProps) {
    const payer = this.provider.publicKey
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [user] = this.pda.user(payer)
    const [pair] = this.pda.pair(tokenA, tokenB)
    const pairData = await this.fetchPair(pair)

    const [admin] = this.pda.admin()
    const [manager] = this.pda.manager(pairData.authority)
    const [pairAuthority] = this.pda.pairAuthority(pair)
    const [whitelistedUserInfo] = this.pda.whitelistedUserInfo(payer, pair)

    const tx = new Transaction()

    const sourceA = getAssociatedTokenAddressSync(tokenA, payer)
    const destinationA = await this.handleMissingTokenAccount(tx, tokenA, pairAuthority)
    const destinationB = await this.handleMissingTokenAccount(tx, tokenB, payer)

    tx.add(createLockTokensInstruction(
      {
        proofRequest: props.proofRequest,
        user,
        userAuthority: payer,
        pair,
        pairAuthority,
        admin,
        manager,
        whitelistedUserInfo,
        feePayer: props.feePayer ?? payer,
        feeReceiver: pairData.feeReceiver,
        sourceA,
        destinationA,
        destinationB,
        tokenA,
        tokenB,
      },
      {
        amount: new BN(props.amount),
      },
    ))
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      pair,
    }
  }

  async unlockTokens(props: UnlockTokensProps) {
    const payer = this.provider.publicKey
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [admin] = this.pda.admin()
    const [user] = this.pda.user(payer)
    const [pair] = this.pda.pair(tokenA, tokenB)
    const [pairAuthority] = this.pda.pairAuthority(pair)
    const [whitelistedUserInfo] = this.pda.whitelistedUserInfo(payer, pair)
    const pairData = await this.fetchPair(pair)
    const [manager] = this.pda.manager(pairData.authority)

    const tx = new Transaction()

    // const sourceB = getAssociatedTokenAddressSync(tokenB, payer)
    const sourceB = await this.handleMissingTokenAccount(tx, tokenB, payer)
    const sourceA = await this.handleMissingTokenAccount(tx, tokenA, pairAuthority)
    const destinationA = await this.handleMissingTokenAccount(tx, tokenA, payer)

    tx.add(createUnlockTokensInstruction(
      {
        proofRequest: props.proofRequest,
        user,
        userAuthority: payer,
        pair,
        pairAuthority,
        feePayer: props.feePayer ?? payer,
        feeReceiver: pairData.feeReceiver,
        whitelistedUserInfo,
        admin,
        destinationA,
        manager,
        sourceA,
        sourceB,
        tokenA,
        tokenB,
      },
      {
        amount: new BN(props.amount),
      },
    ))

    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      pair,
      user,
    }
  }

  async addUserToWhitelist(props: WhitelistProps) {
    const payer = this.provider.publicKey
    const [manager] = this.pda.manager(payer)
    const userWallet = props.userWallet
    const [user] = this.pda.user(userWallet)
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [pair] = this.pda.pair(tokenA, tokenB)
    const [whitelistedUserInfo] = this.pda.whitelistedUserInfo(userWallet, pair)

    const ix = createAddUserToWhitelistInstruction(
      {
        userAuthority: userWallet,
        authority: payer,
        manager,
        pair,
        tokenA,
        tokenB,
        user,
        whitelistedUserInfo,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      user,
      whitelistedUserInfo,
    }
  }

  async removeUserFromWhitelist(props: WhitelistProps) {
    const payer = this.provider.publicKey
    const userWallet = props.userWallet
    const [user] = this.pda.user(userWallet)
    const [pair] = this.pda.pair(props.tokenA, props.tokenB)
    const [whitelistedUserInfo] = this.pda.whitelistedUserInfo(userWallet, pair)

    const ix = createRemoveUserFromWhitelistInstruction(
      {
        authority: payer,
        pair,
        whitelistedUserInfo,

      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      user,
      whitelistedUserInfo,
    }
  }

  async blockUser(props: UpdateUserProps) {
    const payer = this.provider.publicKey
    const [manager] = this.pda.manager(payer)
    const userWallet = props.userWallet
    const [user] = this.pda.user(userWallet)

    const ix = createBlockUserInstruction(
      {
        authority: payer,
        manager,
        user,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      user,
    }
  }

  async unblockUser(props: UpdateUserProps) {
    const authority = this.provider.publicKey
    const userWallet = props.userWallet
    const [manager] = this.pda.manager(authority)
    const [user] = this.pda.user(userWallet)

    const ix = createUnblockUserInstruction(
      {
        authority,
        manager,
        user,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      user,
    }
  }

  async pausePairs(props: ManagerProps) {
    const payer = this.provider.publicKey
    const managerWallet = props.managerWallet
    const [manager] = this.pda.manager(managerWallet)
    const [admin] = this.pda.admin()

    const ix = createPausePairsInstruction(
      {
        admin,
        authority: payer,
        manager,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      manager,
    }
  }

  async pausePlatform() {
    const payer = this.provider.publicKey
    const [admin] = this.pda.admin()

    const ix = createPausePlatformInstruction(
      {
        admin,
        authority: payer,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      admin,
    }
  }

  async removeManager(props: ManagerProps) {
    const payer = this.provider.publicKey
    const managerWallet = props.managerWallet
    const [manager] = this.pda.manager(managerWallet)
    const [admin] = this.pda.admin()

    const ix = createRemoveManagerInstruction(
      {
        admin,
        authority: payer,
        manager,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      manager,
    }
  }

  async removePair(props: RemovePairProps) {
    const authority = this.provider.publicKey
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [pair] = this.pda.pair(tokenA, tokenB)

    const ix = createRemovePairInstruction({ authority, pair })
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      pair,
    }
  }

  async resumePairs(props: ManagerProps) {
    const authority = this.provider.publicKey
    const managerWallet = props.managerWallet
    const [manager] = this.pda.manager(managerWallet)
    const [admin] = this.pda.admin()

    const ix = createResumePairsInstruction(
      {
        authority,
        admin,
        manager,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      manager,
    }
  }

  async resumePlatform() {
    const authority = this.provider.publicKey
    const [admin] = this.pda.admin()

    const ix = createResumePlatformInstruction(
      {
        authority,
        admin,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      admin,
    }
  }

  async setAdmin(props: SetAdminProps) {
    const authority = this.provider.publicKey
    const [admin] = this.pda.admin()
    const ix = createSetAdminInstruction(
      {
        authority,
        admin,
      },
      {
        key: props.authority,
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return { signature }
  }

  async withdrawFee(props: WithdrawFeeProps) {
    const authority = this.provider.publicKey
    const [pair] = this.pda.pair(props.tokenA, props.tokenB)
    const [pairAuthority] = this.pda.pairAuthority(pair)

    const ix = createWithdrawFeeInstruction(
      {
        authority,
        pair,
        pairAuthority,
        destination: props.destination,
      },
      {
        amount: new BN(props.amount),
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
    }
  }

  async updatePair(props: UpdatePairProps) {
    const authority = this.provider.publicKey
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [pair] = this.pda.pair(tokenA, tokenB)

    const ix = createUpdatePairInstruction(
      {
        authority,
        pair,
      },
      {
        data: {
          feeReceiver: props.feeReceiver ?? null,
          lockFee: props.lockFee ?? null,
          unlockFee: props.unlockFee ?? null,
          newAuthority: props.newAuthority ?? null,
          isPaused: props.isPaused ?? null,
          ratio: props.ratio ?? null,
        },
      },
    )
    const tx = new Transaction().add(ix)
    const signature = await this.provider.sendAndConfirm(tx)

    return {
      signature,
      pair,
    }
  }

  private async handleMissingTokenAccount(tx: Transaction, mint: PublicKey, owner?: PublicKey) {
    const _owner = owner ?? this.provider.publicKey
    const account = getAssociatedTokenAddressSync(mint, _owner, true)
    try {
      await getAccount(this.provider.connection, account)
    } catch (error: unknown) {
      if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            this.provider.publicKey,
            account,
            _owner,
            mint,
          ),
        )
      }
    }
    return account
  }
}

// PDA searching functions
class SmartConverterPDA {
  pairAuthority = (pair: Address) => this.pda([
    new web3.PublicKey(pair).toBuffer(),
  ])

  admin = () => this.pda([
    Buffer.from(ADMIN_SEED_PREFIX),
  ])

  manager = (wallet: Address) => this.pda([
    Buffer.from(MANAGER_SEED_PREFIX),
    new web3.PublicKey(wallet).toBuffer(),
  ])

  user = (wallet: Address) => this.pda([
    Buffer.from(USER_SEED_PREFIX),
    new web3.PublicKey(wallet).toBuffer(),
  ])

  pair = (tokenA: Address, tokenB: Address) => this.pda([
    Buffer.from(PAIR_SEED_PREFIX),
    new web3.PublicKey(tokenA).toBuffer(),
    new web3.PublicKey(tokenB).toBuffer(),
  ])

  whitelistedUserInfo = (wallet: Address, pair: Address) => this.pda([
    Buffer.from(WHITELIST_SEED_PREFIX),
    new web3.PublicKey(wallet).toBuffer(),
    new web3.PublicKey(pair).toBuffer(),
  ])

  private pda(seeds: Array<Buffer | Uint8Array>) {
    return web3.PublicKey.findProgramAddressSync(seeds, SmartConverterClient.programId)
  }
}

export type Wallet = {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

type AddPairProps = {
  /// Security token mint address
  tokenA: PublicKey
  /// Utility token mint address
  tokenB?: PublicKey
  tokenBKeypair?: Keypair
  /// Ratio of token A to token B
  ratio?: Ratio
  /// Albus policy
  policy?: PublicKey
}

type WhitelistProps = {
  userWallet: PublicKey
  tokenA: PublicKey
  tokenB: PublicKey
}

type UpdateUserProps = {
  userWallet: PublicKey
}

type LockTokensProps = {
  /// Mint A
  tokenA: PublicKey
  /// Mint B
  tokenB: PublicKey
  // /// User Token A
  // sourceA: PublicKey
  // /// Pair Token A
  // destinationA: PublicKey
  // /// User Token B
  // destinationB: PublicKey
  amount: number | BN
  feePayer?: PublicKey
  proofRequest?: PublicKey
}

type ManagerProps = {
  managerWallet: PublicKey
}

type RemovePairProps = {
  tokenA: PublicKey
  tokenB: PublicKey
}

type SetAdminProps = {
  authority: PublicKey
}

type WithdrawFeeProps = {
  tokenA: PublicKey
  tokenB: PublicKey
  destination: PublicKey
  amount: number | BN
}

type UnlockTokensProps = {
  tokenA: PublicKey
  tokenB: PublicKey
  amount: number | BN
  feePayer?: PublicKey
  proofRequest?: PublicKey
}

type UpdatePairProps = {
  tokenA: PublicKey
  tokenB: PublicKey
  newAuthority?: PublicKey
  isPaused?: boolean
  ratio?: Ratio
  feeReceiver?: PublicKey
  lockFee?: number
  unlockFee?: number
}
