use anchor_lang::prelude::*;

use crate::{state::{Manager, Admin}, ErrorCode};

/// The admin can remove manager.
pub fn remove_manager(_ctx: Context<UpdateManager>) -> Result<()> {
    Ok(())
}

/// The admin can pause all manager's pairs.
pub fn pause_pairs(ctx: Context<UpdateManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;

    if manager.is_all_paused {
        return Err(ErrorCode::AlreadyPaused.into());
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
        close = authority
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(
        mut,
        seeds = [Admin::SEED],
        bump,
        has_one = authority,
    )]
    pub admin: Box<Account<'info, Admin>>,

    /// CHECK: Address of manager's wallet to update
    pub manager_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
