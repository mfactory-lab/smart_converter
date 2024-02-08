use crate::*;

#[event]
pub struct LockTokensEvent {
    #[index]
    pub pair: Pubkey,
    pub user: Pubkey,
    pub user_authority: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct UnlockTokensEvent {
    #[index]
    pub pair: Pubkey,
    pub user: Pubkey,
    pub user_authority: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}
