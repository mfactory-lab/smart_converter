use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Pair {
    /// Manager authority
    pub authority: Pubkey,
    /// Security token mint address
    pub token_a: Pubkey,
    /// Utility token mint address
    pub token_b: Pubkey,
    /// Amount of security tokens currently locked
    pub locked_amount: u64,
    /// Ratio of token A to token B
    pub ratio: Ratio,
    /// Indicates if pair is paused or not
    pub is_paused: bool,
    /// Fee for locking token A
    pub lock_fee: u16,
    /// Fee for unlocking token A
    pub unlock_fee: u16,
    /// Wallet that will receive fee
    pub fee_receiver: Pubkey,
    /// Albus policy
    pub policy: Option<Pubkey>,
}

impl Pair {
    pub const SEED: &'static [u8] = b"pair";

    #[inline]
    pub fn space() -> usize {
        8 + Self::INIT_SPACE
    }
}

#[account]
#[derive(InitSpace)]
pub struct Admin {
    /// Manager wallet address
    pub authority: Pubkey,
    /// Indicates if platform is paused or not
    pub is_platform_paused: bool,
}

impl Admin {
    pub const SEED: &'static [u8] = b"admin";

    #[inline]
    pub fn space() -> usize {
        8 + Self::INIT_SPACE
    }
}

#[account]
#[derive(InitSpace)]
pub struct Manager {
    /// Manager address
    pub authority: Pubkey,
    /// Indicates if manager's pairs are paused or not
    pub is_all_paused: bool,
}

impl Manager {
    pub const SEED: &'static [u8] = b"manager";

    #[inline]
    pub fn space() -> usize {
        8 + Self::INIT_SPACE
    }
}

#[account]
#[derive(InitSpace)]
pub struct User {
    /// User address
    pub authority: Pubkey,
    /// Indicates if user is blocked or not
    pub is_blocked: bool,
}

impl User {
    pub const SEED: &'static [u8] = b"user";

    #[inline]
    pub fn space() -> usize {
        8 + Self::INIT_SPACE
    }
}

#[account]
#[derive(InitSpace)]
pub struct WhitelistedUserInfo {
    /// User address
    pub user: Pubkey,
    /// Pair address
    pub pair: Pubkey,
}

impl WhitelistedUserInfo {
    pub const SEED: &'static [u8] = b"whitelist";

    #[inline]
    pub fn space() -> usize {
        8 + Self::INIT_SPACE
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct Ratio {
    pub num: u64,
    pub denom: u64,
}
