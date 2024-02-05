use anchor_lang::prelude::*;

use crate::{state::Admin, SmartConverterError};

/// The admin can pause platform.
pub fn pause(ctx: Context<ChangePlatformState>) -> Result<()> {
    let admin = &mut ctx.accounts.admin;

    if admin.is_platform_paused {
        return Err(SmartConverterError::IsPaused.into());
    }

    admin.is_platform_paused = true;

    Ok(())
}

/// The admin can resume platform.
pub fn resume(ctx: Context<ChangePlatformState>) -> Result<()> {
    let admin = &mut ctx.accounts.admin;

    if !admin.is_platform_paused {
        return Err(SmartConverterError::AlreadyResumed.into());
    }

    admin.is_platform_paused = false;

    Ok(())
}

#[derive(Accounts)]
pub struct ChangePlatformState<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [Admin::SEED],
        bump,
        has_one = authority,
    )]
    pub admin: Box<Account<'info, Admin>>,

    pub system_program: Program<'info, System>,
}
