use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{state::{Manager, Admin, Pair}, ErrorCode};
use crate::state::User;

/// The manager can block user.
pub fn block(ctx: Context<UpdateUser>) -> Result<()> {
    let user = &mut ctx.accounts.user;

    if user.is_blocked {
        return Err(ErrorCode::IsBlocked.into());
    }

    user.is_blocked = true;

    Ok(())
}

/// The manager can unblock user.
pub fn unblock(ctx: Context<UpdateUser>) -> Result<()> {
    let user = &mut ctx.accounts.user;

    if !user.is_blocked {
        return Err(ErrorCode::AlreadyUnblocked.into());
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

    #[account(
        mut,
        seeds = [User::SEED, user_wallet.key().as_ref()],
        bump,
    )]
    pub user: Box<Account<'info, User>>,

    /// CHECK: Address of user's wallet to update
    pub user_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
