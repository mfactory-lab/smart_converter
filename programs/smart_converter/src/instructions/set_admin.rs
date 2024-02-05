use anchor_lang::prelude::*;

use crate::utils::cmp_pubkeys;
use crate::{state::Admin, SmartConverterError};

/// The admin can set new admin.
pub fn handle(ctx: Context<SetAdmin>, new_authority: Pubkey) -> Result<()> {
    let admin = &mut ctx.accounts.admin;

    if !cmp_pubkeys(&admin.authority, &Default::default())
        && !cmp_pubkeys(&admin.authority, &ctx.accounts.authority.key())
    {
        return Err(SmartConverterError::Unauthorized.into());
    }

    admin.authority = new_authority;

    Ok(())
}

#[derive(Accounts)]
pub struct SetAdmin<'info> {
    #[account(
        init_if_needed,
        seeds = [Admin::SEED],
        bump,
        payer = authority,
        space = Admin::space(),
    )]
    pub admin: Box<Account<'info, Admin>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
