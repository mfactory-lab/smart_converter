use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::state::{Manager, Pair, User, WhitelistedUserInfo};

/// The manager can remove user from whitelist for special pair.
/// After that user can't lock and unlock tokens from special pair.
pub fn handle(_ctx: Context<RemoveUserFromWhitelist>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct RemoveUserFromWhitelist<'info> {
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

    /// CHECK: Address of user's wallet to add to whitelist
    pub user_wallet: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [WhitelistedUserInfo::SEED, user_wallet.key().as_ref(), pair.key().as_ref()],
        bump,
        close = authority
    )]
    pub whitelisted_user_info: Box<Account<'info, WhitelistedUserInfo>>,

    #[account(
        mut,
        seeds = [Pair::SEED, token_a.key().as_ref(), token_b.key().as_ref()],
        bump,
        constraint = pair.manager_wallet == authority.key()
    )]
    pub pair: Box<Account<'info, Pair>>,

    #[account(mut)]
    pub token_a: Account<'info, token::Mint>,

    #[account(mut)]
    pub token_b: Account<'info, token::Mint>,

    pub system_program: Program<'info, System>,
}
