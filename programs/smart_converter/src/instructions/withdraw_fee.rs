use anchor_lang::{prelude::*, system_program};
use anchor_spl::token;

use crate::{
    state::{Manager, Pair},
    ErrorCode,
};

/// The manager can withdraw SOL from pair account.
/// It is useful when pool do not have any special fee_receiver and all fee is transferred to default pair account.
pub fn handle(ctx: Context<WithdrawFee>, amount: u64) -> Result<()> {
    let pair = &mut ctx.accounts.pair;
    let pair_key = pair.key();
    let pair_authority_seeds = [pair_key.as_ref(), &[ctx.bumps["pair_authority"]]];

    if amount == 0 || ctx.accounts.pair_authority.lamports() < amount {
        msg!("Invalid amount");
        return Err(ErrorCode::InsufficientFunds.into());
    }

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.pair_authority.to_account_info(),
                to: ctx.accounts.destination.to_account_info(),
            },
            &[&pair_authority_seeds],
        ),
        amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFee<'info> {
    #[account(
        mut,
        seeds = [Pair::SEED, token_a.key().as_ref(), token_b.key().as_ref()],
        bump,
        constraint = pair.manager_wallet == authority.key(),
    )]
    pub pair: Box<Account<'info, Pair>>,

    #[account(mut)]
    pub token_a: Box<Account<'info, token::Mint>>,

    #[account(mut)]
    pub token_b: Box<Account<'info, token::Mint>>,

    /// CHECK: no needs to check, only for signing
    #[account(seeds = [pair.key().as_ref()], bump)]
    pub pair_authority: AccountInfo<'info>,

    /// CHECK: wallet for transfer
    #[account(mut)]
    pub destination: AccountInfo<'info>,

    #[account(mut, seeds = [Manager::SEED, authority.key().as_ref()], bump)]
    pub manager: Box<Account<'info, Manager>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
