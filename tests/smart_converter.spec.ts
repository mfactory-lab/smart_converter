import { BN, web3 } from '@coral-xyz/anchor'
import { afterAll, assert, beforeAll, describe, it } from 'vitest'
import { SmartConverterClient } from '@smart-converter/sdk'
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'
import { AlbusClient, ProofRequestStatus } from '@albus-finance/sdk'
import { AlbusTester, airdrop, assertErrorCode, newProvider } from './utils'

export const payer = Keypair.fromSecretKey(Uint8Array.from([
  46, 183, 156, 94, 55, 128, 248, 0, 49, 70, 183, 244, 178, 0, 0, 236,
  212, 131, 76, 78, 112, 48, 25, 79, 249, 33, 43, 158, 199, 2, 168, 18,
  55, 174, 166, 159, 57, 67, 197, 158, 255, 142, 177, 177, 47, 39, 35, 185,
  148, 253, 191, 58, 219, 119, 104, 89, 225, 26, 244, 119, 160, 6, 156, 227,
]))

const managerKeypair = web3.Keypair.generate()
const userKeypair = web3.Keypair.generate()

const providerAdmin = newProvider(payer)
const providerManager = newProvider(managerKeypair)
const providerUser = newProvider(userKeypair)

describe('smartConverter', () => {
  const clientAdmin = new SmartConverterClient(providerAdmin)
  const clientManager = new SmartConverterClient(providerManager)
  const clientUser = new SmartConverterClient(providerUser)

  const clientAlbusAdmin = new AlbusClient(providerAdmin).local()
  const clientAlbusUser = new AlbusClient(providerUser).local()

  let mintA: web3.PublicKey
  let mintB: web3.PublicKey
  let userA: web3.PublicKey
  let userB: web3.PublicKey
  let pairA: web3.PublicKey

  let policy: web3.PublicKey

  const albusTester = new AlbusTester(clientAlbusAdmin)

  beforeAll(async () => {
    await airdrop(providerAdmin.connection, providerAdmin.publicKey, 10)
    await airdrop(providerManager.connection, providerManager.publicKey, 10)
    await airdrop(providerUser.connection, providerUser.publicKey, 10)

    const testData = await albusTester.init()
    policy = testData.policy
  })

  afterAll(async () => {
    await albusTester.clear()
  })

  console.log('Admin address:', providerAdmin.publicKey.toString())
  console.log('Manager address:', providerManager.publicKey.toString())
  console.log('User address:', providerUser.publicKey.toString())

  describe('admin instructions', async () => {
    it('can initialize admin', async () => {
      try {
        await clientAdmin.setAdmin({ authority: providerAdmin.publicKey })
      } catch (e) {
        console.log(e)
        throw e
      }
      const adminData = await clientAdmin.fetchAdmin()
      assert.equal(adminData.authority.equals(providerAdmin.publicKey), true)
    })

    it('can set new admin', async () => {
      try {
        await clientAdmin.setAdmin({ authority: providerAdmin.publicKey })
      } catch (e) {
        console.log(e)
        throw e
      }
      const adminData = await clientAdmin.fetchAdmin()
      assert.equal(adminData.authority.equals(providerAdmin.publicKey), true)
    })

    it('can not set admin via non-admin wallet', async () => {
      try {
        await clientManager.setAdmin({
          authority: providerManager.publicKey,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'Unauthorized')
      }
    })

    it('can pause platform', async () => {
      try {
        await clientAdmin.pausePlatform()
      } catch (e) {
        console.log(e)
        throw e
      }

      const adminData = await clientAdmin.fetchAdmin()
      assert.equal(adminData.isPlatformPaused, true)
    })

    it('can resume platform', async () => {
      try {
        await clientAdmin.resumePlatform()
      } catch (e) {
        console.log(e)
        throw e
      }

      const adminData = await clientAdmin.fetchAdmin()
      assert.equal(adminData.isPlatformPaused, false)
    })

    it('can not add manager from non-admin wallet', async () => {
      try {
        const { manager } = await clientManager.addManager({
          managerWallet: providerManager.wallet.publicKey,
        })
        const managerData = await clientManager.fetchManager(manager)
        assert.equal(managerData, null)
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, '')
      }
    })

    it('can add manager', async () => {
      try {
        const { manager } = await clientAdmin.addManager({
          managerWallet: providerManager.wallet.publicKey,
        })
        const managerData = await clientAdmin.fetchManager(manager)
        assert.equal(managerData.authority.equals(providerManager.wallet.publicKey), true)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can pause manager pairs', async () => {
      try {
        const { manager } = await clientAdmin.pausePairs({
          managerWallet: providerManager.wallet.publicKey,
        })
        const managerData = await clientAdmin.fetchManager(manager)
        assert.equal(managerData.isAllPaused, true)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can resume manager pairs', async () => {
      try {
        const { manager } = await clientAdmin.resumePairs({
          managerWallet: providerManager.wallet.publicKey,
        })
        const managerData = await clientAdmin.fetchManager(manager)
        assert.equal(managerData.isAllPaused, false)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can remove manager', async () => {
      try {
        const { manager } = await clientAdmin.removeManager({
          managerWallet: providerManager.wallet.publicKey,
        })
        const managerData = await clientAdmin.fetchManager(manager)
        assert.equal(managerData, null)
      } catch (e) {
        console.log(e)
        throw e
      }
    })
  })

  describe('manager instructions', async () => {
    it('can add pair', async () => {
      try {
        await clientAdmin.addManager({
          managerWallet: providerManager.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      const tokenAKeypair = web3.Keypair.generate()
      const tokenBKeypair = web3.Keypair.generate()

      const [pair] = clientManager.pda.pair(tokenAKeypair.publicKey, tokenBKeypair.publicKey)
      const [pairAuthority] = clientManager.pda.pairAuthority(pair)

      mintA = await createMint(providerManager.connection, managerKeypair, providerManager.wallet.publicKey, null, 9, tokenAKeypair, undefined, TOKEN_PROGRAM_ID)
      mintB = await createMint(providerManager.connection, managerKeypair, pairAuthority, null, 9, tokenBKeypair, undefined, TOKEN_PROGRAM_ID)

      try {
        await clientManager.addPair({
          ratio: {
            num: 10,
            denom: 1,
          },
          tokenA: mintA,
          tokenB: mintB,
          policy,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      const pairData = await clientManager.fetchPair(pair)

      assert.equal(pairData.authority.equals(providerManager.wallet.publicKey), true)
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
      try {
        await clientManager.addPair({
          ratio: {
            num: 10,
            denom: 1,
          },
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assert.ok(true)
      }
    })

    it('can update pair', async () => {
      try {
        const { pair } = await clientManager.updatePair({
          feeReceiver: providerManager.wallet.publicKey,
          isPaused: true,
          lockFee: 10,
          newAuthority: providerManager.wallet.publicKey,
          ratio: {
            num: 100,
            denom: 1,
          },
          tokenA: mintA,
          tokenB: mintB,
          unlockFee: 10,
        })

        const pairData = await clientManager.fetchPair(pair)
        assert.equal(pairData.authority.equals(providerManager.wallet.publicKey), true)
        assert.equal(pairData.tokenA.equals(mintA), true)
        assert.equal(pairData.tokenB.equals(mintB), true)
        assert.equal(pairData.feeReceiver.equals(providerManager.wallet.publicKey), true)
        assert.equal(pairData.ratio.num, 100)
        assert.equal(pairData.ratio.denom, 1)
        assert.equal(pairData.lockedAmount, 0)
        assert.equal(pairData.lockFee, 10)
        assert.equal(pairData.unlockFee, 10)
        assert.equal(pairData.isPaused, true)
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientManager.updatePair({
          isPaused: false,
          ratio: {
            num: 10,
            denom: 1,
          },
          tokenA: mintA,
          tokenB: mintB,
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can add user to whitelist', async () => {
      try {
        const { user, whitelistedUserInfo } = await clientManager.addUserToWhitelist({
          tokenA: mintA,
          tokenB: mintB,
          userWallet: providerUser.wallet.publicKey,
        })
        const [pair] = clientManager.pda.pair(mintA, mintB)
        const userData = await clientManager.fetchUser(user)
        const whitelistedUserInfoData = await clientManager.fetchWhitelistedUserInfo(whitelistedUserInfo)
        assert.equal(userData.authority.equals(providerUser.wallet.publicKey), true)
        assert.equal(userData.isBlocked, false)
        assert.equal(whitelistedUserInfoData.user.equals(providerUser.wallet.publicKey), true)
        assert.equal(whitelistedUserInfoData.pair.equals(pair), true)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can remove user from whitelist', async () => {
      try {
        const { user, whitelistedUserInfo } = await clientManager.removeUserFromWhitelist({
          tokenA: mintA,
          tokenB: mintB,
          userWallet: providerUser.wallet.publicKey,
        })
        const userData = await clientManager.fetchUser(user)
        const whitelistedUserInfoData = await clientManager.fetchWhitelistedUserInfo(whitelistedUserInfo)
        assert.equal(userData.authority.equals(providerUser.wallet.publicKey), true)
        assert.equal(userData.isBlocked, false)
        assert.equal(whitelistedUserInfoData, null)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can block user', async () => {
      try {
        const { user } = await clientManager.blockUser({
          userWallet: providerUser.wallet.publicKey,
        })
        const userData = await clientManager.fetchUser(user)
        assert.equal(userData.isBlocked, true)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can unblock user', async () => {
      try {
        const { user } = await clientManager.unblockUser({
          userWallet: providerUser.wallet.publicKey,
        })
        const userData = await clientManager.fetchUser(user)
        assert.equal(userData.isBlocked, false)
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not call manager instruction from non-manager wallet', async () => {
      try {
        await clientAdmin.blockUser({
          userWallet: providerUser.wallet.publicKey,
        })

        assert.ok(false)
      } catch (e) {
        assert.ok(true)
      }
    })

    it('can withdraw fee', async () => {
      const [pair] = clientManager.pda.pair(mintA, mintB)
      const [pairAuthority] = clientManager.pda.pairAuthority(pair)

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: providerManager.wallet.publicKey,
          toPubkey: pairAuthority,
          lamports: web3.LAMPORTS_PER_SOL,
        }),
      )

      try {
        await providerManager.sendAndConfirm(transaction)
      } catch (e: any) {
        console.log(e)
        throw e
      }

      try {
        await clientManager.withdrawFee({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destination: providerManager.wallet.publicKey,
          tokenA: mintA,
          tokenB: mintB,
        })
      } catch (e: any) {
        console.log(e)
        throw e
      }
    })
  })

  describe('user instructions', async () => {
    it('can not lock tokens if user is not whitelisted and Proof Request is not created', async () => {
      userA = await createAssociatedTokenAccount(providerUser.connection, userKeypair, mintA, providerUser.wallet.publicKey)
      userB = await createAssociatedTokenAccount(providerUser.connection, userKeypair, mintB, providerUser.wallet.publicKey)
      const [pair] = clientUser.pda.pair(mintA, mintB)
      const [pairAuthority] = clientUser.pda.pairAuthority(pair)
      pairA = (await getOrCreateAssociatedTokenAccount(providerUser.connection, userKeypair, mintA, pairAuthority, true)).address
      await mintTo(providerManager.connection, managerKeypair, mintA, userA, providerManager.wallet.publicKey, 6 * web3.LAMPORTS_PER_SOL, [], undefined, TOKEN_PROGRAM_ID)

      try {
        await clientUser.lockTokens({
          amount: new BN(5 * web3.LAMPORTS_PER_SOL),
          destinationA: pairA,
          destinationB: userB,
          sourceA: userA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'Unauthorized')
      }
    })

    it('can not unlock tokens if user is not whitelisted and Proof Request is not created', async () => {
      try {
        await clientUser.unlockTokens({
          amount: new BN(5 * web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'Unauthorized')
      }
    })

    it('can not lock/unlock tokens if user is not whitelisted and Proof Request is not verified', async () => {
      const proofRequest = await albusTester.createProofRequest(clientAlbusUser, ProofRequestStatus.Rejected)

      try {
        await clientUser.unlockTokens({
          amount: new BN(5 * web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
          proofRequest,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'Custom(3)')
      }
    })

    it('can lock/unlock tokens if user is not whitelisted but has verified Proof Request', async () => {
      const proofRequest = await albusTester.createProofRequest(clientAlbusUser)

      let sourceABalance = await providerUser.connection.getTokenAccountBalance(userA)
      let destinationABalance = await providerUser.connection.getTokenAccountBalance(pairA)
      let destinationBBalance = await providerUser.connection.getTokenAccountBalance(userB)
      assert.equal(destinationABalance.value.amount, '0')
      assert.equal(sourceABalance.value.amount, '6000000000')
      assert.equal(destinationBBalance.value.amount, '0')

      try {
        const { pair } = await clientUser.lockTokens({
          amount: new BN(5 * web3.LAMPORTS_PER_SOL),
          destinationA: pairA,
          destinationB: userB,
          sourceA: userA,
          tokenA: mintA,
          tokenB: mintB,
          proofRequest,
        })

        sourceABalance = await providerUser.connection.getTokenAccountBalance(userA)
        destinationABalance = await providerUser.connection.getTokenAccountBalance(pairA)
        destinationBBalance = await providerUser.connection.getTokenAccountBalance(userB)
        assert.equal(destinationABalance.value.amount, '5000000000')
        assert.equal(sourceABalance.value.amount, '1000000000')
        assert.equal(destinationBBalance.value.amount, '50000000000')

        const pairData = await clientManager.fetchPair(pair)
        assert.equal(pairData.lockedAmount, 5 * web3.LAMPORTS_PER_SOL)
      } catch (e: any) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.unlockTokens({
          amount: new BN(5 * web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
          proofRequest,
        })
      } catch (e: any) {
        console.log(e)
        throw e
      }
    })

    it('can lock tokens if user whitelisted', async () => {
      await clientManager.addUserToWhitelist({
        tokenA: mintA,
        tokenB: mintB,
        userWallet: providerUser.publicKey,
      })

      let sourceABalance = await providerUser.connection.getTokenAccountBalance(userA)
      let destinationABalance = await providerUser.connection.getTokenAccountBalance(pairA)
      let destinationBBalance = await providerUser.connection.getTokenAccountBalance(userB)
      assert.equal(sourceABalance.value.amount, '6000000000')
      assert.equal(destinationABalance.value.amount, '0')
      assert.equal(destinationBBalance.value.amount, '0')

      try {
        const { pair } = await clientUser.lockTokens({
          amount: new BN(5 * web3.LAMPORTS_PER_SOL),
          destinationA: pairA,
          destinationB: userB,
          sourceA: userA,
          tokenA: mintA,
          tokenB: mintB,
        })

        const pairData = await clientManager.fetchPair(pair)
        assert.equal(pairData.lockedAmount, 5 * web3.LAMPORTS_PER_SOL)
      } catch (e: any) {
        console.log(e)
        throw e
      }

      sourceABalance = await providerUser.connection.getTokenAccountBalance(userA)
      destinationABalance = await providerUser.connection.getTokenAccountBalance(pairA)
      destinationBBalance = await providerUser.connection.getTokenAccountBalance(userB)
      assert.equal(destinationABalance.value.amount, '5000000000')
      assert.equal(sourceABalance.value.amount, '1000000000')
      assert.equal(destinationBBalance.value.amount, '50000000000')
    })

    it('can not lock tokens if user blocked', async () => {
      try {
        await clientManager.blockUser({
          userWallet: providerUser.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.lockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: pairA,
          destinationB: userB,
          sourceA: userA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsBlocked')
      }

      try {
        await clientManager.unblockUser({
          userWallet: providerUser.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not lock tokens if pair paused', async () => {
      try {
        await clientManager.updatePair({
          isPaused: true,
          tokenA: mintA,
          tokenB: mintB,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.lockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: pairA,
          destinationB: userB,
          sourceA: userA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsPaused')
      }

      try {
        await clientManager.updatePair({
          isPaused: false,
          tokenA: mintA,
          tokenB: mintB,
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not lock tokens if all manager`s pairs paused', async () => {
      try {
        await clientAdmin.pausePairs({
          managerWallet: providerManager.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.lockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: pairA,
          destinationB: userB,
          sourceA: userA,
          tokenA: mintA,
          tokenB: mintB,
        })

        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsPaused')
      }

      try {
        await clientAdmin.resumePairs({
          managerWallet: providerManager.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not lock tokens if platform paused', async () => {
      try {
        await clientAdmin.pausePlatform()
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.lockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: pairA,
          destinationB: userB,
          sourceA: userA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsPaused')
      }

      try {
        await clientAdmin.resumePlatform()
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can unlock tokens if user whitelisted', async () => {
      let sourceABalance = await providerUser.connection.getTokenAccountBalance(userA)
      let destinationABalance = await providerUser.connection.getTokenAccountBalance(pairA)
      let destinationBBalance = await providerUser.connection.getTokenAccountBalance(userB)
      assert.equal(destinationABalance.value.amount, '5000000000')
      assert.equal(sourceABalance.value.amount, '1000000000')
      assert.equal(destinationBBalance.value.amount, '50000000000')

      try {
        const { pair } = await clientUser.unlockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
        })
        const pairData = await clientManager.fetchPair(pair)
        assert.equal(pairData.lockedAmount, 4 * web3.LAMPORTS_PER_SOL)
      } catch (e: any) {
        console.log(e)
        throw e
      }

      sourceABalance = await providerUser.connection.getTokenAccountBalance(userA)
      destinationABalance = await providerUser.connection.getTokenAccountBalance(pairA)
      destinationBBalance = await providerUser.connection.getTokenAccountBalance(userB)
      assert.equal(destinationABalance.value.amount, '4000000000')
      assert.equal(sourceABalance.value.amount, '2000000000')
      assert.equal(destinationBBalance.value.amount, '40000000000')
    })

    it('can not unlock tokens if user blocked', async () => {
      try {
        await clientManager.blockUser({
          userWallet: providerUser.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.unlockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsBlocked')
      }

      try {
        await clientManager.unblockUser({
          userWallet: providerUser.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not unlock tokens if pair paused', async () => {
      try {
        await clientManager.updatePair({
          isPaused: true,
          tokenA: mintA,
          tokenB: mintB,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.unlockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsPaused')
      }

      try {
        await clientManager.updatePair({
          isPaused: false,
          tokenA: mintA,
          tokenB: mintB,
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not unlock tokens if all manager`s pairs paused', async () => {
      try {
        await clientAdmin.pausePairs({
          managerWallet: providerManager.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.unlockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsPaused')
      }

      try {
        await clientAdmin.resumePairs({
          managerWallet: providerManager.wallet.publicKey,
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not unlock tokens if platform paused', async () => {
      try {
        await clientAdmin.pausePlatform()
      } catch (e) {
        console.log(e)
        throw e
      }

      try {
        await clientUser.unlockTokens({
          amount: new BN(web3.LAMPORTS_PER_SOL),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'IsPaused')
      }

      try {
        await clientAdmin.resumePlatform()
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    it('can not unlock tokens if wished amount is greater than pair`s locked amount', async () => {
      try {
        await clientUser.unlockTokens({
          amount: new BN(4 * web3.LAMPORTS_PER_SOL + 1),
          destinationA: userA,
          sourceB: userB,
          sourceA: pairA,
          tokenA: mintA,
          tokenB: mintB,
        })
        assert.ok(false)
      } catch (e: any) {
        assertErrorCode(e, 'InsufficientLockedAmount')
      }
    })
  })
})
