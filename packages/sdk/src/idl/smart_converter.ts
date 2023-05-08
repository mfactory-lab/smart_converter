export interface SmartConverter {
  'version': '0.0.4'
  'name': 'smart_converter'
  'instructions': [
    {
      'name': 'addManager'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'managerWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'manager'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'admin'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'addPair'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'pairAuthority'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': [
        {
          'name': 'ratio'
          'type': {
            'defined': 'Ratio'
          }
        },
      ]
    },
    {
      'name': 'addUserToWhitelist'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'user'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'userWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'whitelistedUserInfo'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'removeUserFromWhitelist'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'user'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'userWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'whitelistedUserInfo'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'pausePlatform'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'admin'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'resumePlatform'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'admin'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'lockTokens'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'user'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'whitelistedUserInfo'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'zkpRequest'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'admin'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'pairAuthority'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'managerWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'sourceA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'destinationA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'destinationB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'feePayer'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'feeReceiver'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'clock'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'tokenProgram'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': [
        {
          'name': 'amount'
          'type': 'u64'
        },
      ]
    },
    {
      'name': 'setAdmin'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'adminWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'admin'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'unlockTokens'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'user'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'whitelistedUserInfo'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'zkpRequest'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'admin'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'pairAuthority'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'managerWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'sourceA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'destinationA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'sourceB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'feePayer'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'feeReceiver'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'clock'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'tokenProgram'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': [
        {
          'name': 'amount'
          'type': 'u64'
        },
      ]
    },
    {
      'name': 'removeManager'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'admin'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'managerWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'pausePairs'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'admin'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'managerWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'resumePairs'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'admin'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'managerWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'removePair'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'updatePair'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': [
        {
          'name': 'data'
          'type': {
            'defined': 'UpdatePairData'
          }
        },
      ]
    },
    {
      'name': 'blockUser'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'user'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'userWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'unblockUser'
      'accounts': [
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'manager'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'user'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'userWallet'
          'isMut': false
          'isSigner': false
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': []
    },
    {
      'name': 'withdrawFee'
      'accounts': [
        {
          'name': 'pair'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenA'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'tokenB'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'pairAuthority'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'destination'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'manager'
          'isMut': true
          'isSigner': false
        },
        {
          'name': 'authority'
          'isMut': true
          'isSigner': true
        },
        {
          'name': 'systemProgram'
          'isMut': false
          'isSigner': false
        },
      ]
      'args': [
        {
          'name': 'amount'
          'type': 'u64'
        },
      ]
    },
  ]
  'accounts': [
    {
      'name': 'admin'
      'type': {
        'kind': 'struct'
        'fields': [
          {
            'name': 'authority'
            'docs': [
              'Manager wallet address',
            ]
            'type': 'publicKey'
          },
          {
            'name': 'isPlatformPaused'
            'docs': [
              'Indicates if platform is paused or not',
            ]
            'type': 'bool'
          },
        ]
      }
    },
    {
      'name': 'manager'
      'type': {
        'kind': 'struct'
        'fields': [
          {
            'name': 'authority'
            'docs': [
              'Manager wallet address',
            ]
            'type': 'publicKey'
          },
          {
            'name': 'isAllPaused'
            'docs': [
              'Indicates if manager\'s pairs are paused or not',
            ]
            'type': 'bool'
          },
        ]
      }
    },
    {
      'name': 'user'
      'type': {
        'kind': 'struct'
        'fields': [
          {
            'name': 'userWallet'
            'docs': [
              'User wallet address',
            ]
            'type': 'publicKey'
          },
          {
            'name': 'isBlocked'
            'docs': [
              'Indicates if user is blocked or not',
            ]
            'type': 'bool'
          },
        ]
      }
    },
    {
      'name': 'whitelistedUserInfo'
      'type': {
        'kind': 'struct'
        'fields': [
          {
            'name': 'userWallet'
            'docs': [
              'User wallet address',
            ]
            'type': 'publicKey'
          },
          {
            'name': 'pair'
            'docs': [
              'Pair address',
            ]
            'type': 'publicKey'
          },
        ]
      }
    },
    {
      'name': 'pair'
      'type': {
        'kind': 'struct'
        'fields': [
          {
            'name': 'managerWallet'
            'docs': [
              'Manager wallet address',
            ]
            'type': 'publicKey'
          },
          {
            'name': 'tokenA'
            'docs': [
              'Security token mint address',
            ]
            'type': 'publicKey'
          },
          {
            'name': 'tokenB'
            'docs': [
              'Utility token mint address',
            ]
            'type': 'publicKey'
          },
          {
            'name': 'lockedAmount'
            'docs': [
              'Amount of security tokens currently locked',
            ]
            'type': 'u64'
          },
          {
            'name': 'ratio'
            'docs': [
              'Ratio of token A to token B',
            ]
            'type': {
              'defined': 'Ratio'
            }
          },
          {
            'name': 'isPaused'
            'docs': [
              'Indicates if pair is paused or not',
            ]
            'type': 'bool'
          },
          {
            'name': 'lockFee'
            'docs': [
              'Fee for locking token A',
            ]
            'type': 'u16'
          },
          {
            'name': 'unlockFee'
            'docs': [
              'Fee for unlocking token A',
            ]
            'type': 'u16'
          },
          {
            'name': 'feeReceiver'
            'docs': [
              'Wallet that will receive fee',
            ]
            'type': 'publicKey'
          },
        ]
      }
    },
  ]
  'types': [
    {
      'name': 'UpdatePairData'
      'type': {
        'kind': 'struct'
        'fields': [
          {
            'name': 'managerWallet'
            'type': {
              'option': 'publicKey'
            }
          },
          {
            'name': 'isPaused'
            'type': {
              'option': 'bool'
            }
          },
          {
            'name': 'ratio'
            'type': {
              'option': {
                'defined': 'Ratio'
              }
            }
          },
          {
            'name': 'lockFee'
            'type': {
              'option': 'u16'
            }
          },
          {
            'name': 'unlockFee'
            'type': {
              'option': 'u16'
            }
          },
          {
            'name': 'feeReceiver'
            'type': {
              'option': 'publicKey'
            }
          },
        ]
      }
    },
    {
      'name': 'Ratio'
      'type': {
        'kind': 'struct'
        'fields': [
          {
            'name': 'num'
            'type': 'u64'
          },
          {
            'name': 'denom'
            'type': 'u64'
          },
        ]
      }
    },
  ]
  'events': [
    {
      'name': 'LockTokensEvent'
      'fields': [
        {
          'name': 'pair'
          'type': 'publicKey'
          'index': true
        },
        {
          'name': 'user'
          'type': 'publicKey'
          'index': true
        },
        {
          'name': 'userWallet'
          'type': 'publicKey'
          'index': false
        },
        {
          'name': 'amount'
          'type': 'u64'
          'index': false
        },
        {
          'name': 'timestamp'
          'type': 'i64'
          'index': false
        },
      ]
    },
    {
      'name': 'UnlockTokensEvent'
      'fields': [
        {
          'name': 'pair'
          'type': 'publicKey'
          'index': true
        },
        {
          'name': 'user'
          'type': 'publicKey'
          'index': true
        },
        {
          'name': 'userWallet'
          'type': 'publicKey'
          'index': false
        },
        {
          'name': 'amount'
          'type': 'u64'
          'index': false
        },
        {
          'name': 'timestamp'
          'type': 'i64'
          'index': false
        },
      ]
    },
  ]
  'errors': [
    {
      'code': 6000
      'name': 'Unauthorized'
      'msg': 'Unauthorized action'
    },
    {
      'code': 6001
      'name': 'IsPaused'
      'msg': 'Paused'
    },
    {
      'code': 6002
      'name': 'AlreadyResumed'
      'msg': 'Already resumed'
    },
    {
      'code': 6003
      'name': 'StillRemainingLockedTokens'
      'msg': 'Pair still have locked tokens'
    },
    {
      'code': 6004
      'name': 'IsBlocked'
      'msg': 'User is blocked'
    },
    {
      'code': 6005
      'name': 'AlreadyUnblocked'
      'msg': 'User is already unblocked'
    },
    {
      'code': 6006
      'name': 'InsufficientLockedAmount'
      'msg': 'Insufficient locked amount'
    },
    {
      'code': 6007
      'name': 'InsufficientFunds'
      'msg': 'Insufficient funds'
    },
  ]
}

export const IDL: SmartConverter = {
  version: '0.0.4',
  name: 'smart_converter',
  instructions: [
    {
      name: 'addManager',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'managerWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'manager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'addPair',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pairAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'ratio',
          type: {
            defined: 'Ratio',
          },
        },
      ],
    },
    {
      name: 'addUserToWhitelist',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'whitelistedUserInfo',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'removeUserFromWhitelist',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'whitelistedUserInfo',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'pausePlatform',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'resumePlatform',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'lockTokens',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedUserInfo',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'zkpRequest',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pairAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'managerWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'sourceA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'destinationA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'destinationB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'feePayer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'feeReceiver',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'setAdmin',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'adminWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'unlockTokens',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedUserInfo',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'zkpRequest',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pairAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'managerWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'sourceA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'destinationA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'sourceB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'feePayer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'feeReceiver',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'removeManager',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'managerWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'pausePairs',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'managerWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'resumePairs',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'managerWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'removePair',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'updatePair',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: 'UpdatePairData',
          },
        },
      ],
    },
    {
      name: 'blockUser',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'unblockUser',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'manager',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userWallet',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'withdrawFee',
      accounts: [
        {
          name: 'pair',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenA',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenB',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pairAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'destination',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'manager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'admin',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            docs: [
              'Manager wallet address',
            ],
            type: 'publicKey',
          },
          {
            name: 'isPlatformPaused',
            docs: [
              'Indicates if platform is paused or not',
            ],
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'manager',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            docs: [
              'Manager wallet address',
            ],
            type: 'publicKey',
          },
          {
            name: 'isAllPaused',
            docs: [
              'Indicates if manager\'s pairs are paused or not',
            ],
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'user',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'userWallet',
            docs: [
              'User wallet address',
            ],
            type: 'publicKey',
          },
          {
            name: 'isBlocked',
            docs: [
              'Indicates if user is blocked or not',
            ],
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'whitelistedUserInfo',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'userWallet',
            docs: [
              'User wallet address',
            ],
            type: 'publicKey',
          },
          {
            name: 'pair',
            docs: [
              'Pair address',
            ],
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'pair',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'managerWallet',
            docs: [
              'Manager wallet address',
            ],
            type: 'publicKey',
          },
          {
            name: 'tokenA',
            docs: [
              'Security token mint address',
            ],
            type: 'publicKey',
          },
          {
            name: 'tokenB',
            docs: [
              'Utility token mint address',
            ],
            type: 'publicKey',
          },
          {
            name: 'lockedAmount',
            docs: [
              'Amount of security tokens currently locked',
            ],
            type: 'u64',
          },
          {
            name: 'ratio',
            docs: [
              'Ratio of token A to token B',
            ],
            type: {
              defined: 'Ratio',
            },
          },
          {
            name: 'isPaused',
            docs: [
              'Indicates if pair is paused or not',
            ],
            type: 'bool',
          },
          {
            name: 'lockFee',
            docs: [
              'Fee for locking token A',
            ],
            type: 'u16',
          },
          {
            name: 'unlockFee',
            docs: [
              'Fee for unlocking token A',
            ],
            type: 'u16',
          },
          {
            name: 'feeReceiver',
            docs: [
              'Wallet that will receive fee',
            ],
            type: 'publicKey',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'UpdatePairData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'managerWallet',
            type: {
              option: 'publicKey',
            },
          },
          {
            name: 'isPaused',
            type: {
              option: 'bool',
            },
          },
          {
            name: 'ratio',
            type: {
              option: {
                defined: 'Ratio',
              },
            },
          },
          {
            name: 'lockFee',
            type: {
              option: 'u16',
            },
          },
          {
            name: 'unlockFee',
            type: {
              option: 'u16',
            },
          },
          {
            name: 'feeReceiver',
            type: {
              option: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'Ratio',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'num',
            type: 'u64',
          },
          {
            name: 'denom',
            type: 'u64',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'LockTokensEvent',
      fields: [
        {
          name: 'pair',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'user',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'userWallet',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false,
        },
      ],
    },
    {
      name: 'UnlockTokensEvent',
      fields: [
        {
          name: 'pair',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'user',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'userWallet',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'Unauthorized',
      msg: 'Unauthorized action',
    },
    {
      code: 6001,
      name: 'IsPaused',
      msg: 'Paused',
    },
    {
      code: 6002,
      name: 'AlreadyResumed',
      msg: 'Already resumed',
    },
    {
      code: 6003,
      name: 'StillRemainingLockedTokens',
      msg: 'Pair still have locked tokens',
    },
    {
      code: 6004,
      name: 'IsBlocked',
      msg: 'User is blocked',
    },
    {
      code: 6005,
      name: 'AlreadyUnblocked',
      msg: 'User is already unblocked',
    },
    {
      code: 6006,
      name: 'InsufficientLockedAmount',
      msg: 'Insufficient locked amount',
    },
    {
      code: 6007,
      name: 'InsufficientFunds',
      msg: 'Insufficient funds',
    },
  ],
}
