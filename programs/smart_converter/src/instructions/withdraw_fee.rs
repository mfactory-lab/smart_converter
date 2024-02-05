use anchor_lang::{prelude::*, system_program};

use crate::{state::Pair, SmartConverterError};

/// The manager can withdraw SOL from pair account.
/// It is useful when pool do not have any special fee_receiver and all fee is transferred to default pair account.
pub fn handle(ctx: Context<WithdrawFee>, amount: u64) -> Result<()> {
    let pair = &mut ctx.accounts.pair;
    let pair_key = pair.key();
    let pair_seeds = [pair_key.as_ref(), &[ctx.bumps.pair_authority]];

    if amount == 0 || ctx.accounts.pair_authority.lamports() < amount {
        msg!("Invalid amount");
        return Err(SmartConverterError::InsufficientFunds.into());
    }

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.pair_authority.to_account_info(),
                to: ctx.accounts.destination.to_account_info(),
            },
            &[&pair_seeds],
        ),
        amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFee<'info> {
    #[account(mut, has_one = authority)]
    pub pair: Box<Account<'info, Pair>>,

    /// CHECK: no needs to check, only for signing
    #[account(mut, seeds = [pair.key().as_ref()], bump)]
    pub pair_authority: AccountInfo<'info>,

    /// CHECK: wallet for transfer
    #[account(mut)]
    pub destination: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
