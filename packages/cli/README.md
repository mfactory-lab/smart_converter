# Smart Converter CLI

CLI with Smart Converter endpoints.

## Commands

```bash
pnpm cli -c <CLUSTER> -k <PATH_TO_PRIVATE_KEY> -l <LOG_LEVEL> <COMMAND>
```

CLUSTER: mainnet-beta, testnet or devnet; devnet is the default value

PATH_TO_PRIVATE_KEY: the default value is ${process.env.HOME}/.config/solana/id.json

LOG_LEVEL: info, error or warn

COMMAND: the main command that determines the request that will be sent to the smart-converter contract

### Example

Running the command (manager add) for the Testnet cluster:

```bash
pnpm cli -c testnet manager add
```

Running the command (manager add) for the default Devnet cluster:

```bash
pnpm cli manager add
```

> NOTE: The command takes required and optional arguments. To view them, run it with -h or --help.

```bash
pnpm cli manager add -h
```

-------------------------------------------------------
Conversion
-------------------------------------------------------

> NOTE: The parentheses at the end specify a role that can call the instruction.

Lock tokens:

```bash
pnpm cli lock
```

Unlock tokens:

```bash
pnpm cli unlopck
```

-------------------------------------------------------
Manager
-------------------------------------------------------

Add manager (admin):

```bash
pnpm cli manager add
```

Remove manager (admin):

```bash
pnpm cli manager remove
```

Pause manager's pairs (admin):

```bash
pnpm cli manager pause
```

Resume manager's pairs (admin):

```bash
pnpm cli manager resume
```

Show manager's info:

```bash
pnpm cli manager show
```

Find and show manager's info:

```bash
pnpm cli manager find
```

Show all managers:

```bash
pnpm cli manager show-all
```

Show manager's pairs:

```bash
pnpm cli manager show-pairs
```

-------------------------------------------------------
Admin
-------------------------------------------------------

Set admin (admin):

```bash
pnpm cli admin set
```

Pause platform (admin):

```bash
pnpm cli admin pause-platform
```

Resume platform (admin):

```bash
pnpm cli admin resume-platform
```

Show admin's info:

```bash
pnpm cli admin show
```

-------------------------------------------------------
Pair
-------------------------------------------------------

Add new pair (manager):

```bash
pnpm cli pair add
```

Remove pair (manager):

```bash
pnpm cli pair remove
```

Update pair (manager):

```bash
pnpm cli pair update
```

Withdraw fee (manager):

```bash
pnpm cli pair withdraw-fee
```

Show pair's info:

```bash
pnpm cli pair show
```

Find and show pair's info:

```bash
pnpm cli pair find
```

Show all pairs:

```bash
pnpm cli pair show-all
```

Show all whitelisted users:

```bash
pnpm cli pair show-users
```

-------------------------------------------------------
User
-------------------------------------------------------

Add new user to whitelist (manager):

```bash
pnpm cli user add
```

Remove user from whitelist (manager):

```bash
pnpm cli user remove
```

Block user (manager):

```bash
pnpm cli user block
```

Unblock user (manager):

```bash
pnpm cli user unblock
```

Show user's info:

```bash
pnpm cli user show
```

Find and show user's info:

```bash
pnpm cli user find
```

Show available pairs for user:

```bash
pnpm cli user show-available
```
