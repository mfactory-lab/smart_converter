import type { Address, BN, Program } from '@project-serum/anchor'
import type { PublicKey } from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'
import { web3 } from '@project-serum/anchor'
import type { Admin, Manager, Pair, Ratio, User } from './generated'
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
  createResumePairsInstruction,
  createResumePlatformInstruction,
  createSetAdminInstruction,
  createUnblockUserInstruction,
  createUnlockTokensInstruction,
  createUpdatePairInstruction,
} from './generated'
import { IDL } from './idl/smart_converter'

const USER_SEED_PREFIX = 'user'
const MANAGER_SEED_PREFIX = 'manager'
const PAIR_SEED_PREFIX = 'pair'
const ADMIN_SEED_PREFIX = 'admin'

export class SmartConverterClient {
  static programId = PROGRAM_ID
  static IDL = IDL
  static clock = web3.SYSVAR_CLOCK_PUBKEY

  constructor(private readonly props: SmartConverterClientProps) {}

  get program() {
    return this.props.program
  }

  get wallet() {
    return this.props.wallet
  }

  get pda() {
    return new SmartConverterPDA()
  }

  // Fetch functions
  async fetchManager(address: Address) {
    return await this.program.account.manager.fetchNullable(address) as unknown as Manager
  }

  async fetchAdmin(address: Address) {
    return await this.program.account.admin.fetchNullable(address) as unknown as Admin
  }

  async fetchUser(address: Address) {
    return await this.program.account.user.fetchNullable(address) as unknown as User
  }

  async fetchPair(address: Address) {
    return await this.program.account.pair.fetchNullable(address) as unknown as Pair
  }

  // Functions that construct instructions using pre-generated sdk
  async addManager(props: ManagerProps) {
    const payer = this.wallet.publicKey
    const managerWallet = props.managerWallet
    const [manager] = await this.pda.manager(managerWallet)
    const [admin] = await this.pda.admin()

    const ix = createAddManagerInstruction(
      {
        admin,
        authority: payer,
        manager,
        managerWallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      manager,
    }
  }

  async addPair(props: AddPairProps) {
    const payer = this.wallet.publicKey
    const [manager] = await this.pda.manager(payer)
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [pair] = await this.pda.pair(tokenA, tokenB)
    const [pairAuthority] = await this.pda.pairAuthority(pair)

    const ix = createAddPairInstruction(
      {
        authority: payer,
        manager,
        pair,
        pairAuthority,
        tokenA,
        tokenB,
      },
      {
        ratio: props.ratio,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      pair,
    }
  }

  async addUserToWhitelist(props: AddUserToWhitelistProps) {
    const payer = this.wallet.publicKey
    const [manager] = await this.pda.manager(payer)
    const userWallet = props.userWallet
    const [user] = await this.pda.user(userWallet)

    const ix = createAddUserToWhitelistInstruction(
      {
        authority: payer,
        manager,
        user,
        userWallet,
      },
      {
        amount: props.amount,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      user,
    }
  }

  async blockUser(props: UpdateUserProps) {
    const payer = this.wallet.publicKey
    const [manager] = await this.pda.manager(payer)
    const userWallet = props.userWallet
    const [user] = await this.pda.user(userWallet)

    const ix = createBlockUserInstruction(
      {
        authority: payer,
        manager,
        user,
        userWallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      user,
    }
  }

  async lockTokens(props: LockTokensProps) {
    const payer = this.wallet.publicKey
    const managerWallet = props.managerWallet
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [manager] = await this.pda.manager(managerWallet)
    const [user] = await this.pda.user(payer)
    const [pair] = await this.pda.pair(tokenA, tokenB)
    const [pairAuthority] = await this.pda.pairAuthority(pair)
    const [admin] = await this.pda.admin()

    const ix = createLockTokensInstruction(
      {
        clock: SmartConverterClient.clock,
        admin,
        authority: payer,
        destinationA: props.destinationA,
        destinationB: props.destinationB,
        manager,
        managerWallet,
        pair,
        pairAuthority,
        sourceA: props.sourceA,
        tokenA,
        tokenB,
        user,
      },
      {
        amount: props.amount,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      pair,
      user,
    }
  }

  async pausePairs(props: ManagerProps) {
    const payer = this.wallet.publicKey
    const managerWallet = props.managerWallet
    const [manager] = await this.pda.manager(managerWallet)
    const [admin] = await this.pda.admin()

    const ix = createPausePairsInstruction(
      {
        admin,
        authority: payer,
        manager,
        managerWallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      manager,
    }
  }

  async pausePlatform() {
    const payer = this.wallet.publicKey
    const [admin] = await this.pda.admin()

    const ix = createPausePlatformInstruction(
      {
        admin,
        authority: payer,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      admin,
    }
  }

  async removeManager(props: ManagerProps) {
    const payer = this.wallet.publicKey
    const managerWallet = props.managerWallet
    const [manager] = await this.pda.manager(managerWallet)
    const [admin] = await this.pda.admin()

    const ix = createRemoveManagerInstruction(
      {
        admin,
        authority: payer,
        manager,
        managerWallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      manager,
    }
  }

  async removePair(props: RemovePairProps) {
    const payer = this.wallet.publicKey
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [manager] = await this.pda.manager(payer)
    const [pair] = await this.pda.pair(tokenA, tokenB)

    const ix = createRemovePairInstruction(
      {
        authority: payer,
        manager,
        pair,
        tokenA,
        tokenB,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      pair,
    }
  }

  async resumePairs(props: ManagerProps) {
    const payer = this.wallet.publicKey
    const managerWallet = props.managerWallet
    const [manager] = await this.pda.manager(managerWallet)
    const [admin] = await this.pda.admin()

    const ix = createResumePairsInstruction(
      {
        admin,
        authority: payer,
        manager,
        managerWallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      manager,
    }
  }

  async resumePlatform() {
    const payer = this.wallet.publicKey
    const [admin] = await this.pda.admin()

    const ix = createResumePlatformInstruction(
      {
        admin,
        authority: payer,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      admin,
    }
  }

  async setAdmin(props: SetAdminProps) {
    const payer = this.wallet.publicKey
    const adminWallet = props.adminWallet
    const [admin] = await this.pda.admin()

    const ix = createSetAdminInstruction(
      {
        admin,
        authority: payer,
        adminWallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      admin,
    }
  }

  async unblockUser(props: UpdateUserProps) {
    const payer = this.wallet.publicKey
    const userWallet = props.userWallet
    const [manager] = await this.pda.manager(payer)
    const [user] = await this.pda.user(userWallet)

    const ix = createUnblockUserInstruction(
      {
        authority: payer,
        manager,
        user,
        userWallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      user,
    }
  }

  async unlockTokens(props: UnlockTokensProps) {
    const payer = this.wallet.publicKey
    const managerWallet = props.managerWallet
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [manager] = await this.pda.manager(managerWallet)
    const [admin] = await this.pda.admin()
    const [user] = await this.pda.user(payer)
    const [pair] = await this.pda.pair(tokenA, tokenB)
    const [pairAuthority] = await this.pda.pairAuthority(pair)

    const ix = createUnlockTokensInstruction(
      {
        clock: SmartConverterClient.clock,
        admin,
        authority: payer,
        destinationA: props.destinationA,
        manager,
        managerWallet,
        pair,
        pairAuthority,
        sourceA: props.sourceA,
        sourceB: props.sourceB,
        tokenA,
        tokenB,
        user,
      },
      {
        amount: props.amount,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      pair,
      user,
    }
  }

  async updatePair(props: UpdatePairProps) {
    const payer = this.wallet.publicKey
    const tokenA = props.tokenA
    const tokenB = props.tokenB
    const [manager] = await this.pda.manager(payer)
    const [pair] = await this.pda.pair(tokenA, tokenB)

    const ix = createUpdatePairInstruction(
      {
        authority: payer,
        manager,
        pair,
        tokenA,
        tokenB,
      },
      {
        data: {
          managerWallet: props.managerWallet ?? null,
          isPaused: props.isPaused ?? null,
          ratio: props.ratio ?? null,
        },
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      manager,
    }
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

  private async pda(seeds: Array<Buffer | Uint8Array>) {
    return await web3.PublicKey.findProgramAddress(seeds, SmartConverterClient.programId)
  }
}

export interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

// Interfaces for instruction-constructing functions
interface SmartConverterClientProps {
  wallet: Wallet
  program: Program<typeof IDL>
}

interface AddPairProps {
  tokenA: PublicKey
  tokenB: PublicKey
  ratio: Ratio
}

interface AddUserToWhitelistProps {
  userWallet: PublicKey
  amount: BN
}

interface UpdateUserProps {
  userWallet: PublicKey
}

interface LockTokensProps {
  managerWallet: PublicKey
  tokenA: PublicKey
  tokenB: PublicKey
  sourceA: PublicKey
  destinationA: PublicKey
  destinationB: PublicKey
  amount: BN
}

interface ManagerProps {
  managerWallet: PublicKey
}

interface RemovePairProps {
  tokenA: PublicKey
  tokenB: PublicKey
}

interface SetAdminProps {
  adminWallet: PublicKey
}

interface UnlockTokensProps {
  managerWallet: PublicKey
  tokenA: PublicKey
  tokenB: PublicKey
  sourceA: PublicKey
  sourceB: PublicKey
  destinationA: PublicKey
  amount: BN
}

interface UpdatePairProps {
  tokenA: PublicKey
  tokenB: PublicKey
  managerWallet?: PublicKey
  isPaused?: boolean
  ratio?: Ratio
}
