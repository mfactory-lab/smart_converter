use anchor_lang::prelude::*;

use crate::state::{Admin, Manager};

/// The admin can add new manager.
pub fn handle(ctx: Context<AddManager>, authority: Pubkey) -> Result<()> {
    let manager = &mut ctx.accounts.manager;
    manager.authority = authority;

    Ok(())
}

#[derive(Accounts)]
#[instruction(manager_authority: Pubkey)]
pub struct AddManager<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(has_one = authority)]
    pub admin: Box<Account<'info, Admin>>,

    #[account(
        init,
        seeds = [Manager::SEED, manager_authority.key().as_ref()],
        bump,
        payer = authority,
        space = Manager::space()
    )]
    pub manager: Box<Account<'info, Manager>>,

    pub system_program: Program<'info, System>,
}
