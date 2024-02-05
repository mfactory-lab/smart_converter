use anchor_lang::prelude::*;

use crate::{
    state::{Admin, Manager},
    utils, SmartConverterError,
};

/// The admin can remove manager.
pub fn remove_manager(ctx: Context<UpdateManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;

    // close the manager account
    utils::close_account(
        manager.to_account_info(),
        ctx.accounts.authority.to_account_info(),
    )?;

    Ok(())
}

/// The admin can pause all manager's pairs.
pub fn pause_pairs(ctx: Context<UpdateManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;

    if manager.is_all_paused {
        return Err(SmartConverterError::IsPaused.into());
    }

    manager.is_all_paused = true;

    Ok(())
}

/// The admin can unpause all manager's pairs.
pub fn resume_pairs(ctx: Context<UpdateManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;

    if !manager.is_all_paused {
        return Err(SmartConverterError::AlreadyResumed.into());
    }

    manager.is_all_paused = false;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateManager<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub manager: Box<Account<'info, Manager>>,

    #[account(seeds = [Admin::SEED], bump, has_one = authority)]
    pub admin: Box<Account<'info, Admin>>,

    pub system_program: Program<'info, System>,
}
