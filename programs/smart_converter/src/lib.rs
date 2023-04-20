pub mod events;
pub mod instructions;
pub mod state;
mod utils;

use anchor_lang::prelude::*;

use crate::instructions::*;
use crate::state::*;

declare_id!("BSP9GP7vACnCKxEXdqsDpGdnqMBafc6rtQozGwRkKqKH");

#[program]
pub mod smart_converter {
    use super::*;

    pub fn add_manager(ctx: Context<AddManager>) -> Result<()> {
        add_manager::handle(ctx)
    }

    pub fn add_pair(ctx: Context<AddPair>, ratio: Ratio) -> Result<()> {
        add_pair::handle(ctx, ratio)
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

    pub fn set_admin(ctx: Context<SetAdmin>) -> Result<()> {
        set_admin::handle(ctx)
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
}

#[error_code]
pub enum ErrorCode {
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
}
