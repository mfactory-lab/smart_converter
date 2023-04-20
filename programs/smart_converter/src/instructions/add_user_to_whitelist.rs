use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::state::{Manager, Pair, User, WhitelistedUserInfo};

/// The manager can add user to whitelist for special pair.
/// After that user can lock and unlock tokens from special pair.
pub fn handle(ctx: Context<AddUserToWhitelist>) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let user_wallet = ctx.accounts.user_wallet.key();
    let whitelisted_user_info = &mut ctx.accounts.whitelisted_user_info;

    if user.user_wallet != user_wallet {
        user.user_wallet = user_wallet;
    }

    whitelisted_user_info.user_wallet = user_wallet;
    whitelisted_user_info.pair = ctx.accounts.pair.key();

    Ok(())
}

#[derive(Accounts)]
pub struct AddUserToWhitelist<'info> {
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

    #[account(
        init,
        seeds = [WhitelistedUserInfo::SEED, user_wallet.key().as_ref(), pair.key().as_ref()],
        bump,
        payer = authority,
        space = WhitelistedUserInfo::SIZE,
    )]
    pub whitelisted_user_info: Box<Account<'info, WhitelistedUserInfo>>,

    #[account(
        mut,
        seeds = [Pair::SEED, token_a.key().as_ref(), token_b.key().as_ref()],
        bump,
        constraint = pair.manager_wallet == authority.key(),
    )]
    pub pair: Box<Account<'info, Pair>>,

    #[account(mut)]
    pub token_a: Account<'info, token::Mint>,

    #[account(mut)]
    pub token_b: Account<'info, token::Mint>,

    pub system_program: Program<'info, System>,
}
