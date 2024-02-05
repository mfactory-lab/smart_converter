# Smart-converter v.0.0.5

## Introduction

Smart Converter is a program that allows users to convert tokens by locking one token and minting another one that represents the ownership right to the locked token.
Token conversion occurs in specific pairs, which are set by the manager role. In addition to the manager role, Smart Converter has administrator and user roles, each with their own distinct privileges.
To ensure that users comply with applicable regulations, including know-your-customer (KYC) and anti-money laundering (AML) policies, Smart Converter only grants access to its functionality for users who have been verified by Albus or whitelisted by the manager role.
Albus is our proprietary protocol that enables DeFi services to verify that users who want to transact with them comply with their policies. If the Albus verification is used, Smart Converter connects to Albus, and the protocol verifies the user based on the zero-knowledge proof (ZKP) technology. In the case of whitelisting, the manager role permits a specific user to convert tokens within a specific token pair by adding the user’s wallet address to the whitelist.

## License

[GNU AGPL v3](./LICENSE)

## Components

[Program](./programs/smart_converter/Readme.md): smart-converter program.

[CLI](./packages/cli/Readme.md): CLI with smart-converter program endpoints.


## TODO

- Fix manager block/unlock
