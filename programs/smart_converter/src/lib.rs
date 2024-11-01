pub mod events;
pub mod instructions;
pub mod state;
mod utils;

use anchor_lang::prelude::*;

use crate::{instructions::*, state::*};

declare_id!("JDe51ZjpQ3tZzL6QTVPHt5VT5NzaDuJnrTmJJUFrC3vm");

#[program]
pub mod smart_converter {
    use super::*;

    pub fn set_admin(ctx: Context<SetAdmin>, key: Pubkey) -> Result<()> {
        set_admin::handle(ctx, key)
    }

    pub fn add_manager(ctx: Context<AddManager>, key: Pubkey) -> Result<()> {
        add_manager::handle(ctx, key)
    }

    pub fn add_pair(ctx: Context<AddPair>, policy: Option<Pubkey>, ratio: Ratio) -> Result<()> {
        add_pair::handle(ctx, policy, ratio)
    }

    pub fn add_user_to_whitelist(ctx: Context<AddUserToWhitelist>) -> Result<()> {
        add_user_to_whitelist::handle(ctx)
    }

    pub fn remove_user_from_whitelist(ctx: Context<RemoveUserFromWhitelist>) -> Result<()> {
        remove_user_from_whitelist::handle(ctx)
    }

    pub fn pause_platform(ctx: Context<ChangePlatformState>) -> Result<()> {
        pause(ctx)
    }

    pub fn resume_platform(ctx: Context<ChangePlatformState>) -> Result<()> {
        resume(ctx)
    }

    pub fn lock_tokens(ctx: Context<LockTokens>, amount: u64) -> Result<()> {
        lock_tokens::handle(ctx, amount)
    }

    pub fn unlock_tokens(ctx: Context<UnlockTokens>, amount: u64) -> Result<()> {
        unlock_tokens::handle(ctx, amount)
    }

    pub fn remove_manager(ctx: Context<UpdateManager>) -> Result<()> {
        update_manager::remove_manager(ctx)
    }

    pub fn pause_pairs(ctx: Context<UpdateManager>) -> Result<()> {
        update_manager::pause_pairs(ctx)
    }

    pub fn resume_pairs(ctx: Context<UpdateManager>) -> Result<()> {
        update_manager::resume_pairs(ctx)
    }

    pub fn remove_pair(ctx: Context<UpdatePair>) -> Result<()> {
        remove(ctx)
    }

    pub fn update_pair(ctx: Context<UpdatePair>, data: UpdatePairData) -> Result<()> {
        update(ctx, data)
    }

    pub fn block_user(ctx: Context<UpdateUser>) -> Result<()> {
        block(ctx)
    }

    pub fn unblock_user(ctx: Context<UpdateUser>) -> Result<()> {
        unblock(ctx)
    }

    pub fn withdraw_fee(ctx: Context<WithdrawFee>, amount: u64) -> Result<()> {
        withdraw_fee::handle(ctx, amount)
    }
}

#[error_code]
pub enum SmartConverterError {
    #[msg("Unauthorized action")]
    Unauthorized,
    #[msg("Paused")]
    IsPaused,
    #[msg("Already resumed")]
    AlreadyResumed,
    #[msg("Pair still have locked tokens")]
    StillRemainingLockedTokens,
    #[msg("User is blocked")]
    IsBlocked,
    #[msg("User is already unblocked")]
    AlreadyUnblocked,
    #[msg("Insufficient locked amount")]
    InsufficientLockedAmount,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}
