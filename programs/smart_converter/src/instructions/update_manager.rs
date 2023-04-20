use anchor_lang::prelude::*;

use crate::{
    state::{Admin, Manager},
    utils, ErrorCode,
};

/// The admin can remove manager.
pub fn remove_manager(ctx: Context<UpdateManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;

    // close the manager account
    utils::close(manager.to_account_info(), ctx.accounts.authority.to_account_info())?;

    Ok(())
}

/// The admin can pause all manager's pairs.
pub fn pause_pairs(ctx: Context<UpdateManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;

    if manager.is_all_paused {
        return Err(ErrorCode::IsPaused.into());
    }

    manager.is_all_paused = true;

    Ok(())
}

/// The admin can unpause all manager's pairs.
pub fn resume_pairs(ctx: Context<UpdateManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;

    if !manager.is_all_paused {
        return Err(ErrorCode::AlreadyResumed.into());
    }

    manager.is_all_paused = false;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateManager<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [Manager::SEED, manager_wallet.key().as_ref()],
        bump,
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(
        seeds = [Admin::SEED],
        bump,
        has_one = authority,
    )]
    pub admin: Box<Account<'info, Admin>>,

    /// CHECK: Address of manager's wallet to update
    pub manager_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
