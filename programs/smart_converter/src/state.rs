use anchor_lang::prelude::*;

#[account]
pub struct Admin {
    /// Manager wallet address
    pub authority: Pubkey,
    /// Indicates if platform is paused or not
    pub is_platform_paused: bool,
}

impl Admin {
    pub const SEED: &'static [u8] = b"admin";
    pub const SIZE: usize = 8 + 32 + 1;
}

#[account]
pub struct Manager {
    /// Manager wallet address
    pub authority: Pubkey,
    /// Indicates if manager's pairs are paused or not
    pub is_all_paused: bool,
}

impl Manager {
    pub const SEED: &'static [u8] = b"manager";
    pub const SIZE: usize = 8 + 32 + 1;
}

#[account]
pub struct User {
    /// User wallet address
    pub user_wallet: Pubkey,
    /// Indicates if user is blocked or not
    pub is_blocked: bool,
}

impl User {
    pub const SEED: &'static [u8] = b"user";
    pub const SIZE: usize = 8 + 32 + 1;
}

#[account]
pub struct WhitelistedUserInfo {
    /// User wallet address
    pub user_wallet: Pubkey,
    /// Pair address
    pub pair: Pubkey,
}

impl WhitelistedUserInfo {
    pub const SEED: &'static [u8] = b"whitelist";
    pub const SIZE: usize = 8 + 32 + 32;
}

#[account]
pub struct Pair {
    /// Manager wallet address
    pub manager_wallet: Pubkey,
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
}

impl Pair {
    pub const SEED: &'static [u8] = b"pair";
    pub const SIZE: usize = 8 + 32 + 32 + 32 + 8 + 16 + 1 + 2 + 2 + 32;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Ratio {
    pub num: u64,
    pub denom: u64,
}