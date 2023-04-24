import { web3 } from '@project-serum/anchor'
import log from 'loglevel'
import { useContext } from '../context'

interface Opts {
  adminWallet: string
}

export async function setAdmin(opts: Opts) {
  const { provider, client } = useContext()

  const { tx, admin } = await client.setAdmin({
    adminWallet: new web3.PublicKey(opts.adminWallet),
  })

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Admin: ${admin}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function pausePlatform() {
  const { provider, client } = useContext()

  const { tx, admin } = await client.pausePlatform()

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Admin: ${admin}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function resumePlatform() {
  const { provider, client } = useContext()

  const { tx, admin } = await client.resumePlatform()

  try {
    const signature = await provider.sendAndConfirm(tx)
    log.info(`Signature: ${signature}`)
    log.info(`Admin: ${admin}`)
    log.info('OK')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function showAdminInfo() {
  const { client } = useContext()

  const [admin] = await client.pda.admin()
  const adminData = await client.fetchAdmin(admin)

  log.info('--------------------------------------------------------------------------')
  log.info(`Admin: ${admin}`)
  log.info(`Admin wallet: ${adminData.authority}`)
  log.info(`Is platform paused: ${adminData.isPlatformPaused}`)
  log.info('--------------------------------------------------------------------------')
}
