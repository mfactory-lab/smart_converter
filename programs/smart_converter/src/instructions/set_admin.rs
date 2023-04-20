use anchor_lang::prelude::*;

use crate::{state::Admin, ErrorCode};

/// The admin can set new admin.
pub fn handle(ctx: Context<SetAdmin>) -> Result<()> {
    let admin = &mut ctx.accounts.admin;
    let admin_wallet = ctx.accounts.admin_wallet.key();

    if admin.authority != Pubkey::default() && admin.authority != ctx.accounts.authority.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    admin.authority = admin_wallet;

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
