use anchor_lang::prelude::*;

use crate::{
    state::{Manager, User},
    SmartConverterError,
};

/// The manager can block user.
pub fn block(ctx: Context<UpdateUser>) -> Result<()> {
    let user = &mut ctx.accounts.user;

    if user.is_blocked {
        return Err(SmartConverterError::IsBlocked.into());
    }

    user.is_blocked = true;

    Ok(())
}

/// The manager can unblock user.
pub fn unblock(ctx: Context<UpdateUser>) -> Result<()> {
    let user = &mut ctx.accounts.user;

    if !user.is_blocked {
        return Err(SmartConverterError::AlreadyUnblocked.into());
    }

    user.is_blocked = false;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [Manager::SEED, authority.key().as_ref()],
        bump,
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(mut)]
    pub user: Box<Account<'info, User>>,

    pub system_program: Program<'info, System>,
}
