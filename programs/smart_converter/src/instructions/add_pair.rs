use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    state::{Manager, Pair, Ratio},
    ErrorCode,
};

/// The manager can add new pair.
pub fn handle(ctx: Context<AddPair>, ratio: Ratio) -> Result<()> {
    let manager = &ctx.accounts.manager;
    let pair = &mut ctx.accounts.pair;
    let pair_authority = ctx.accounts.pair_authority.key;
    let token_a = &ctx.accounts.token_a;
    let token_b = &ctx.accounts.token_b;

    if token_b.mint_authority.is_none() || token_b.mint_authority.unwrap() != *pair_authority {
        msg!("Invalid utility token mint authority");
        return Err(ErrorCode::Unauthorized.into());
    }

    pair.manager_wallet = manager.authority;
    pair.token_a = token_a.key();
    pair.token_b = token_b.key();
    pair.ratio = ratio;
    pair.fee_receiver = pair_authority.key();

    Ok(())
}

#[derive(Accounts)]
pub struct AddPair<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [Manager::SEED, authority.key().as_ref()],
        bump,
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(
        init,
        seeds = [Pair::SEED, token_a.key().as_ref(), token_b.key().as_ref()],
        bump,
        payer = authority,
        space = Pair::SIZE
    )]
    pub pair: Box<Account<'info, Pair>>,

    /// CHECK: no needs to check, only for signing
    #[account(seeds = [pair.key().as_ref()], bump)]
    pub pair_authority: AccountInfo<'info>,

    #[account(mut)]
    pub token_a: Account<'info, token::Mint>,

    #[account(mut)]
    pub token_b: Account<'info, token::Mint>,

    pub system_program: Program<'info, System>,
}
