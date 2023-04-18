use anchor_lang::prelude::*;

use crate::{state::Admin, ErrorCode};

/// The admin can add new manager.
pub fn handle(ctx: Context<SetAdmin>) -> Result<()> {
    let admin = &mut ctx.accounts.admin;
    let admin_wallet = ctx.accounts.admin_wallet.key();

    if admin.admin_wallet != Pubkey::default() || admin.admin_wallet != ctx.accounts.authority.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    admin.admin_wallet = admin_wallet;

    Ok(())
}

#[derive(Accounts)]
pub struct SetAdmin<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Address of admin's wallet to set
    pub admin_wallet: AccountInfo<'info>,

    #[account(
        init_if_needed,
        seeds = [Admin::SEED],
        bump,
        payer = authority,
        space = Admin::SIZE,
    )]
    pub admin: Box<Account<'info, Admin>>,

    pub system_program: Program<'info, System>,
}
