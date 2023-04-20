import { AnchorProvider, Program, Wallet, web3, BN } from '@project-serum/anchor'
import { assert } from 'chai'
import { SmartConverterClient } from '@smart-converter/sdk/src/client'
import { TOKEN_PROGRAM_ID, createMint } from '@solana/spl-token'

const adminKeypair = web3.Keypair.generate()
const managerKeypair = web3.Keypair.generate()
const userKeypair = web3.Keypair.generate()
const opts = AnchorProvider.defaultOptions()
const providerAdmin = new AnchorProvider(
  new web3.Connection('http://localhost:8899', opts.preflightCommitment),
  new Wallet(adminKeypair),
  AnchorProvider.defaultOptions(),
)
const providerManager = new AnchorProvider(
  new web3.Connection('http://localhost:8899', opts.preflightCommitment),
  new Wallet(managerKeypair),
  AnchorProvider.defaultOptions(),
)
const providerUser = new AnchorProvider(
  new web3.Connection('http://localhost:8899', opts.preflightCommitment),
  new Wallet(userKeypair),
  AnchorProvider.defaultOptions(),
)

describe('smart_converter', () => {
  const clientAdmin = new SmartConverterClient({
    program: new Program(SmartConverterClient.IDL, SmartConverterClient.programId, providerAdmin),
    wallet: providerAdmin.wallet,
  })
  const clientManager = new SmartConverterClient({
    program: new Program(SmartConverterClient.IDL, SmartConverterClient.programId, providerManager),
    wallet: providerManager.wallet,
  })
  const clientUser = new SmartConverterClient({
    program: new Program(SmartConverterClient.IDL, SmartConverterClient.programId, providerUser),
    wallet: providerUser.wallet,
  })

  let mintA: web3.PublicKey
  let mintB: web3.PublicKey

  before(async () => {
    await providerAdmin.connection.confirmTransaction(
      await providerAdmin.connection.requestAirdrop(clientAdmin.wallet.publicKey, 10 * web3.LAMPORTS_PER_SOL),
    )
    await providerAdmin.connection.confirmTransaction(
      await providerAdmin.connection.requestAirdrop(clientManager.wallet.publicKey, 10 * web3.LAMPORTS_PER_SOL),
    )
    await providerAdmin.connection.confirmTransaction(
      await providerAdmin.connection.requestAirdrop(clientUser.wallet.publicKey, 10 * web3.LAMPORTS_PER_SOL),
    )
  })

  describe('admin instructions', async () => {
    it('can initialize admin', async () => {
      const { tx, admin } = await clientAdmin.setAdmin({
        adminWallet: providerAdmin.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const adminData = await clientAdmin.fetchAdmin(admin)
      assert.equal(adminData.authority.equals(providerAdmin.wallet.publicKey), true)
    })

    it('can not set admin via non-admin wallet', async () => {
      const { tx, admin } = await clientManager.setAdmin({
        adminWallet: providerManager.publicKey,
      })

      try {
        await providerManager.sendAndConfirm(tx)
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'Unauthorized')
      }

      const adminData = await clientManager.fetchAdmin(admin)
      assert.equal(adminData.authority.equals(providerAdmin.publicKey), true)
    })

    it('can set new admin', async () => {
      const { tx, admin } = await clientAdmin.setAdmin({
        adminWallet: providerAdmin.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const adminData = await clientAdmin.fetchAdmin(admin)
      assert.equal(adminData.authority.equals(providerAdmin.wallet.publicKey), true)
    })

    it('can pause platform', async () => {
      const { tx, admin } = await clientAdmin.pausePlatform()

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const adminData = await clientAdmin.fetchAdmin(admin)
      assert.equal(adminData.isPlatformPaused, true)
    })

    it('can resume platform', async () => {
      const { tx, admin } = await clientAdmin.resumePlatform()

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const adminData = await clientAdmin.fetchAdmin(admin)
      assert.equal(adminData.isPlatformPaused, false)
    })

    it('can not add manager from non-admin wallet', async () => {
      const { tx, manager } = await clientManager.addManager({
        managerWallet: providerManager.wallet.publicKey,
      })

      try {
        await providerManager.sendAndConfirm(tx)
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, '')
      }

      const managerData = await clientManager.fetchManager(manager)
      assert.equal(managerData, null)
    })

    it('can add manager', async () => {
      const { tx, manager } = await clientAdmin.addManager({
        managerWallet: providerManager.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const managerData = await clientAdmin.fetchManager(manager)
      assert.equal(managerData.authority.equals(providerManager.wallet.publicKey), true)
    })

    it('can pause manager pairs', async () => {
      const { tx, manager } = await clientAdmin.pausePairs({
        managerWallet: providerManager.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const managerData = await clientAdmin.fetchManager(manager)
      assert.equal(managerData.isAllPaused, true)
    })

    it('can resume manager pairs', async () => {
      const { tx, manager } = await clientAdmin.resumePairs({
        managerWallet: providerManager.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const managerData = await clientAdmin.fetchManager(manager)
      assert.equal(managerData.isAllPaused, false)
    })

    it('can remove manager', async () => {
      const { tx, manager } = await clientAdmin.removeManager({
        managerWallet: providerManager.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const managerData = await clientAdmin.fetchManager(manager)
      assert.equal(managerData, null)
    })
  })

  describe('manager instructions', async () => {
    it('can add pair', async () => {
      const { tx } = await clientAdmin.addManager({
        managerWallet: providerManager.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const tokenAKeypair = web3.Keypair.generate()
      const tokenBKeypair = web3.Keypair.generate()

      const [pair] = await clientManager.pda.pair(tokenAKeypair.publicKey, tokenBKeypair.publicKey)
      const [pairAuthority] = await clientManager.pda.pairAuthority(pair)

      mintA = await createMint(providerManager.connection, managerKeypair, providerManager.wallet.publicKey, null, 9, tokenAKeypair, undefined, TOKEN_PROGRAM_ID)
      mintB = await createMint(providerManager.connection, managerKeypair, pairAuthority, null, 9, tokenBKeypair, undefined, TOKEN_PROGRAM_ID)

      const { tx: tx1 } = await clientManager.addPair({
        ratio: {
          num: 10,
          denom: 1,
        },
        tokenA: mintA,
        tokenB: mintB,
      })

      try {
        await providerManager.sendAndConfirm(tx1)
      } catch (e) {
        console.log(e)
        throw e
      }

      const pairData = await clientManager.fetchPair(pair)
      assert.equal(pairData.managerWallet.equals(providerManager.wallet.publicKey), true)
      assert.equal(pairData.tokenA.equals(mintA), true)
      assert.equal(pairData.tokenB.equals(mintB), true)
      assert.equal(pairData.feeReceiver.equals(pairAuthority), true)
      assert.equal(pairData.ratio.num, 10)
      assert.equal(pairData.ratio.denom, 1)
      assert.equal(pairData.lockedAmount, 0)
      assert.equal(pairData.lockFee, 0)
      assert.equal(pairData.unlockFee, 0)
      assert.equal(pairData.isPaused, false)
    })

    it('can not add the same pair', async () => {
      const { tx } = await clientManager.addPair({
        ratio: {
          num: 10,
          denom: 1,
        },
        tokenA: mintA,
        tokenB: mintB,
      })

      try {
        await providerManager.sendAndConfirm(tx)
        assert.ok(false)
      } catch (e: any) {
        assert.ok(true)
      }
    })

    it('can update pair', async () => {
      const { tx, pair } = await clientManager.updatePair({
        feeReceiver: providerManager.wallet.publicKey,
        isPaused: true,
        lockFee: 10,
        managerWallet: providerManager.wallet.publicKey,
        ratio: {
          num: 100,
          denom: 1,
        },
        tokenA: mintA,
        tokenB: mintB,
        unlockFee: 10,
      })

      try {
        await providerManager.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const pairData = await clientManager.fetchPair(pair)
      assert.equal(pairData.managerWallet.equals(providerManager.wallet.publicKey), true)
      assert.equal(pairData.tokenA.equals(mintA), true)
      assert.equal(pairData.tokenB.equals(mintB), true)
      assert.equal(pairData.feeReceiver.equals(providerManager.wallet.publicKey), true)
      assert.equal(pairData.ratio.num, 100)
      assert.equal(pairData.ratio.denom, 1)
      assert.equal(pairData.lockedAmount, 0)
      assert.equal(pairData.lockFee, 10)
      assert.equal(pairData.unlockFee, 10)
      assert.equal(pairData.isPaused, true)

      const { tx: tx1 } = await clientManager.updatePair({
        isPaused: false,
        ratio: {
          num: 10,
          denom: 1,
        },
        tokenA: mintA,
        tokenB: mintB,
      })

      try {
        await providerManager.sendAndConfirm(tx1)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can add user to whitelist', async () => {
      const { tx, user, whitelistedUserInfo } = await clientManager.addUserToWhitelist({
        tokenA: mintA,
        tokenB: mintB,
        userWallet: providerUser.wallet.publicKey,
      })

      try {
        await providerManager.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const [pair] = await clientManager.pda.pair(mintA, mintB)
      const userData = await clientManager.fetchUser(user)
      const whitelistedUserInfoData = await clientManager.fetchWhitelistedUserInfo(whitelistedUserInfo)
      assert.equal(userData.userWallet.equals(providerUser.wallet.publicKey), true)
      assert.equal(userData.isBlocked, false)
      assert.equal(whitelistedUserInfoData.userWallet.equals(providerUser.wallet.publicKey), true)
      assert.equal(whitelistedUserInfoData.pair.equals(pair), true)
    })

    it('can remove user from whitelist', async () => {
      const { tx, user, whitelistedUserInfo } = await clientManager.removeUserFromWhitelist({
        tokenA: mintA,
        tokenB: mintB,
        userWallet: providerUser.wallet.publicKey,
      })

      try {
        await providerManager.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const userData = await clientManager.fetchUser(user)
      const whitelistedUserInfoData = await clientManager.fetchWhitelistedUserInfo(whitelistedUserInfo)
      assert.equal(userData.userWallet.equals(providerUser.wallet.publicKey), true)
      assert.equal(userData.isBlocked, false)
      assert.equal(whitelistedUserInfoData, null)
    })

    it('can block user', async () => {
      const { tx, user } = await clientManager.blockUser({
        userWallet: providerUser.wallet.publicKey,
      })

      try {
        await providerManager.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const userData = await clientManager.fetchUser(user)
      assert.equal(userData.isBlocked, true)
    })

    it('can unblock user', async () => {
      const { tx, user } = await clientManager.unblockUser({
        userWallet: providerUser.wallet.publicKey,
      })

      try {
        await providerManager.sendAndConfirm(tx)
      } catch (e) {
        console.log(e)
        throw e
      }

      const userData = await clientManager.fetchUser(user)
      assert.equal(userData.isBlocked, false)
    })

    it('can not call manager instruction from non-manager wallet', async () => {
      const { tx, user } = await clientAdmin.blockUser({
        userWallet: providerUser.wallet.publicKey,
      })

      try {
        await providerAdmin.sendAndConfirm(tx)
        assert.ok(false)
      } catch (e) {
        assertErrorCode(e, 'AccountNotInitialized')
      }
    })
  })

  describe('user instructions', async () => {
    it('can lock tokens', async () => {

    })

    it('can not lock tokens if user is not whitelisted', async () => {

    })

    it('can not lock tokens if user blocked', async () => {

    })

    it('can not lock tokens if pair paused', async () => {

    })

    it('can not lock tokens if all manager`s pairs paused', async () => {

    })

    it('can not lock tokens if platform paused', async () => {

    })

    it('can unlock tokens', async () => {

    })

    it('can not unlock tokens if user is not whitelisted', async () => {

    })

    it('can not unlock tokens if user blocked', async () => {

    })

    it('can not unlock tokens if pair paused', async () => {

    })

    it('can not unlock tokens if all manager`s pairs paused', async () => {

    })

    it('can not unlock tokens if platform paused', async () => {

    })

    it('can not unlock tokens if wished amount is greater than pair`s locked amount', async () => {

    })
  })
})

export function assertErrorCode(error: { logs?: string[] }, code: string) {
  assert.ok(String((error?.logs ?? []).join('')).includes(`Error Code: ${code}`))
}
