use anchor_lang::prelude::*;

use crate::state::{Admin, Manager};

/// The admin can add new manager.
pub fn handle(ctx: Context<AddManager>) -> Result<()> {
    let manager = &mut ctx.accounts.manager;
    let manager_wallet = ctx.accounts.manager_wallet.key();

    manager.authority = manager_wallet;

    Ok(())
}

#[derive(Accounts)]
pub struct AddManager<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Address of manager's wallet to add
    pub manager_wallet: AccountInfo<'info>,

    #[account(
        init,
        seeds = [Manager::SEED, manager_wallet.key().as_ref()],
        bump,
        payer = authority,
        space = Manager::SIZE
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(
        seeds = [Admin::SEED],
        bump,
        has_one = authority,
    )]
    pub admin: Box<Account<'info, Admin>>,

    pub system_program: Program<'info, System>,
}
