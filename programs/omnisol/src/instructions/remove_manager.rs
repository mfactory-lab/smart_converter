use anchor_lang::prelude::*;

use crate::state::{Manager, Admin};

/// The admin can remove manager.
pub fn handle(_ctx: Context<RemoveManager>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct RemoveManager<'info> {
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
        seeds = [Admin::SEED, authority.key().as_ref()],
        bump,
    )]
    pub admin: Box<Account<'info, Admin>>,

    /// CHECK: Address of manager wallet to remove
    pub manager_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
