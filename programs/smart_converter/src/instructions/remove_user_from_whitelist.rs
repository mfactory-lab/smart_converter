use anchor_lang::prelude::*;

use crate::state::{Pair, WhitelistedUserInfo};

/// The manager can remove user from whitelist for special pair.
/// After that user can't lock and unlock tokens from special pair.
pub fn handle(_ctx: Context<RemoveUserFromWhitelist>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct RemoveUserFromWhitelist<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut, has_one = authority)]
    pub pair: Box<Account<'info, Pair>>,

    #[account(mut, has_one = pair, close = authority)]
    pub whitelisted_user_info: Box<Account<'info, WhitelistedUserInfo>>,

    pub system_program: Program<'info, System>,
}
