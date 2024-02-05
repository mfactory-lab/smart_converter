import type { Command } from 'commander'
import { program as cli } from 'commander'
import log from 'loglevel'
import { version } from '../package.json'
import * as actions from './actions'
import { initContext } from './context'

const DEFAULT_LOG_LEVEL = 'info'
const DEFAULT_CLUSTER = 'devnet'
const DEFAULT_KEYPAIR = `${process.env.HOME}/.config/solana/id.json`

cli
  .version(version)
  .allowExcessArguments(false)
  .option('-c, --cluster <CLUSTER>', 'Solana cluster', DEFAULT_CLUSTER)
  .option('-k, --keypair <KEYPAIR>', 'Filepath or URL to a keypair', DEFAULT_KEYPAIR)
  .option('-l, --log-level <LEVEL>', 'Log level', (l: any) => l && log.setLevel(l), DEFAULT_LOG_LEVEL)
  .hook('preAction', async (command: Command) => {
    const opts = command.opts() as any
    log.setLevel(opts.logLevel)
    const { provider, cluster } = initContext(opts)
    log.info(`# CLI version: ${version}`)
    log.info(`# Keypair: ${provider.wallet.publicKey}`)
    log.info(`# Cluster: ${cluster}`)
  })

// -------------------------------------------------------
// Manager
// -------------------------------------------------------

const manager = cli.command('manager')

manager.command('add')
  .description('Add new manager')
  .requiredOption('-m, --manager-wallet <MANAGER_WALLET>', 'Manager`s wallet address')
  .action(actions.addManager)

manager.command('remove')
  .description('Remove manager')
  .requiredOption('-m, --manager-wallet <MANAGER_WALLET>', 'Manager`s wallet address')
  .action(actions.removeManager)

manager.command('pause')
  .description('Pause all manager`s pairs')
  .requiredOption('-m, --manager-wallet <MANAGER_WALLET>', 'Manager`s wallet address')
  .action(actions.pausePairs)

manager.command('resume')
  .description('Resume all manager`s pairs')
  .requiredOption('-m, --manager-wallet <MANAGER_WALLET>', 'Manager`s wallet address')
  .action(actions.resumePairs)

manager.command('show')
  .description('Show manager info')
  .argument('<ADDRESS>', 'Manager`s PDA address')
  .action(actions.showManagerInfo)

manager.command('find')
  .description('Find and show manager info')
  .argument('<WALLET>', 'Manager`s wallet address')
  .action(actions.findManagerInfo)

manager.command('show-all')
  .description('Show all managers info')
  .action(actions.showAllManagers)

manager.command('show-pairs')
  .description('Show manager`s pairs')
  .argument('<ADDRESS>', 'Manager wallet address')
  .action(actions.showManagerPairs)

// -------------------------------------------------------
// Admin
// -------------------------------------------------------

const admin = cli.command('admin')

admin.command('set')
  .description('Set new admin')
  .requiredOption('-a, --admin-wallet <ADMIN_WALLET>', 'Admin`s wallet address')
  .action(actions.setAdmin)

admin.command('pause-platform')
  .description('Pause platform')
  .action(actions.pausePlatform)

admin.command('resume-platform')
  .description('Resume platform')
  .action(actions.resumePlatform)

admin.command('show')
  .description('Show admin info')
  .action(actions.showAdminInfo)

// -------------------------------------------------------
// Pair
// -------------------------------------------------------

const pair = cli.command('pair')

pair.command('add')
  .description('Add new pair')
  .requiredOption('-n, --num <NUM>', 'Numerator for ratio')
  .requiredOption('-d, --denom <DENOM>', 'Denominator for ratio')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .action(actions.addPair)

pair.command('remove')
  .description('Remove pair')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .action(actions.removePair)

pair.command('update')
  .description('Update pair')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .option('-m, --manager-wallet <MANAGER_WALLET>', 'New manager wallet')
  .option('-p, --is-paused <IS_PAUSED>', 'Set [true] - to pause pair, [false] - to unpause it')
  .option('-n, --num <NUM>', 'New numerator for ratio')
  .option('-d, --denom <DENOM>', 'New denominator for ratio')
  .option('-f, --fee-receiver <FEE_RECEIVER>', 'New fee receiver')
  .option('-fl, --lock-fee <LOCK_FEE>', 'New lock fee in .%')
  .option('-fu, --unlock-fee <UNLOCK_FEE>', 'New unlock fee in .%')
  .action(actions.updatePair)

pair.command('withdraw-fee')
  .description('Withdraw fee from pair`s fee-account')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .requiredOption('-a, --amount <AMOUNT>', 'Amount of lamports to withdraw')
  .requiredOption('-d, --destination <DESTINATION>', 'Transfer destination')
  .action(actions.withdrawFee)

pair.command('show')
  .description('Show pair info')
  .argument('<ADDRESS>', 'Pair`s PDA address')
  .action(actions.showPairInfo)

pair.command('find')
  .description('Find and show pair info')
  .argument('<TOKEN_A>', 'Token A in pair')
  .argument('<TOKEN_B>', 'Token B in pair')
  .action(actions.findPairInfo)

pair.command('show-all')
  .description('Show all pairs info')
  .action(actions.showAllPairs)

pair.command('show-users')
  .description('Show all whitelisted users for pair')
  .argument('<ADDRESS>', 'Pair`s PDA address')
  .action(actions.showWhitelistedUsers)

// -------------------------------------------------------
// User
// -------------------------------------------------------

const user = cli.command('user')

user.command('add')
  .description('Add user to whitelist')
  .requiredOption('-u, --user-wallet <USER_WALLET>', 'User wallet address to add')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .action(actions.addUserToWhitelist)

user.command('remove')
  .description('Remove user from whitelist')
  .requiredOption('-u, --user-wallet <USER_WALLET>', 'User wallet address to add')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .action(actions.removeUserFromWhitelist)

user.command('block')
  .description('Block user')
  .argument('<WALLET>', 'User wallet address to block')
  .action(actions.blockUser)

user.command('unblock')
  .description('Unblock user')
  .argument('<WALLET>', 'User wallet address to unblock')
  .action(actions.unblockUser)

user.command('show')
  .description('Show user info')
  .argument('<ADDRESS>', 'User`s PDA address')
  .action(actions.showUserInfo)

user.command('find')
  .description('Find and show user info')
  .argument('<WALLET>', 'User`s wallet address')
  .action(actions.findUserInfo)

user.command('show-available')
  .description('Show available pairs')
  .argument('<WALLET>', 'User`s wallet address')
  .action(actions.showAvailablePairs)

// -------------------------------------------------------
// Lock
// -------------------------------------------------------

cli.command('lock')
  .description('Lock tokens A in pair to get tokens B')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .requiredOption('-a, --amount <AMOUNT>', 'Amount of tokens to lock')
  .option('-f, --fee-payer <FEE_PAYER>', 'Fee payer wallet')
  .action(actions.lockTokens)

// -------------------------------------------------------
// Unlock
// -------------------------------------------------------

cli.command('unlock')
  .description('Unlock tokens A from pair and burn tokens B')
  .requiredOption('-ta, --token-a <TOKEN_A>', 'Token A in pair')
  .requiredOption('-tb, --token-b <TOKEN_B>', 'Token B in pair')
  .requiredOption('-a, --amount <AMOUNT>', 'Amount of tokens to unlock')
  .option('-f, --fee-payer <FEE_PAYER>', 'Fee payer wallet')
  .action(actions.unlockTokens)

cli.parseAsync(process.argv).then(
  () => {},
  (e: unknown) => {
    throw e
  },
)
