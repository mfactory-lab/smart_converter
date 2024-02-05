import { web3 } from '@coral-xyz/anchor'
import log from 'loglevel'
import { useContext } from '../context'

type Opts = {
  adminWallet: string
}

export async function setAdmin(opts: Opts) {
  const { client } = useContext()

  try {
    const { signature } = await client.setAdmin({
      authority: new web3.PublicKey(opts.adminWallet),
    })

    log.info(`Signature: ${signature}`)
    log.info('Done')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function pausePlatform() {
  const { client } = useContext()

  try {
    const { signature } = await client.pausePlatform()
    log.info(`Signature: ${signature}`)
    log.info('Done')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function resumePlatform() {
  const { client } = useContext()

  try {
    const { signature } = await client.resumePlatform()
    log.info(`Signature: ${signature}`)
    log.info('Done')
  } catch (e) {
    log.info('Error')
    console.log(e)
  }
}

export async function showAdminInfo() {
  const { client } = useContext()

  const [admin] = client.pda.admin()
  const adminData = await client.fetchAdmin(admin)

  log.info('--------------------------------------------------------------------------')
  log.info(`Admin: ${admin}`)
  log.info(`Admin wallet: ${adminData.authority}`)
  log.info(`Is platform paused: ${adminData.isPlatformPaused}`)
  log.info('--------------------------------------------------------------------------')
}
