use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{state::{Manager, Admin, Pair}, ErrorCode};
use crate::state::User;

/// The manager can add user to whitelist.
/// After that user can unlock the whitelisted amount of tokens from any pair.
pub fn handle(ctx: Context<WhitelistUser>, amount: u64) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let user_wallet = ctx.accounts.user_wallet.key();

    if user.user_wallet != user_wallet {
        user.user_wallet = user_wallet;
    }

    user.locked_amount += amount;

    Ok(())
}

#[derive(Accounts)]
pub struct WhitelistUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [Manager::SEED, authority.key().as_ref()],
        bump,
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(
        init_if_needed,
        seeds = [User::SEED, user_wallet.key().as_ref()],
        bump,
        payer = authority,
        space = User::SIZE,
    )]
    pub user: Box<Account<'info, User>>,

    /// CHECK: Address of user's wallet to add to whitelist
    pub user_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
