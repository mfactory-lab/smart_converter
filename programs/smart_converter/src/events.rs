use crate::*;

#[event]
pub struct LockTokensEvent {
    #[index]
    pub pair: Pubkey,
    #[index]
    pub user: Pubkey,
    pub user_wallet: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct UnlockTokensEvent {
    #[index]
    pub pair: Pubkey,
    #[index]
    pub user: Pubkey,
    pub user_wallet: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}
