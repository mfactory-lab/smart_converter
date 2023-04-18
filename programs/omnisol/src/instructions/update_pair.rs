use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{state::{Manager, Admin, Pair}, ErrorCode, utils};

/// The manager can remove pair.
pub fn remove_pair(ctx: Context<UpdatePair>) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    if pair.locked_amount > 0 {
        msg!("Please, wait until all tokens will be unlocked");
        return Err(ErrorCode::StillRemainingLockedTokens.into());
    }

    // close the pair account
    utils::close(pair.to_account_info(), ctx.accounts.authority.to_account_info())?;

    Ok(())
}

/// The manager can pause pair.
pub fn pause(ctx: Context<UpdatePair>) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    if pair.is_paused {
        return Err(ErrorCode::AlreadyPaused.into());
    }

    pair.is_paused = true;

    Ok(())
}

/// The manager can resume pair.
pub fn resume(ctx: Context<UpdatePair>) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    if !pair.is_paused {
        return Err(ErrorCode::AlreadyResumed.into());
    }

    pair.is_paused = false;

    Ok(())
}

/// The manager can set new manager authority.
pub fn set_manager(ctx: Context<UpdatePair>, manager_wallet: Pubkey) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    pair.manager_wallet = manager_wallet;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdatePair<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [Manager::SEED, authority.key().as_ref()],
        bump,
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(
        mut,
        seeds = [Pair::SEED, token_a.key().as_ref(), token_b.key().as_ref()],
        bump,
        constraint = pair.manager_wallet == authority.key(),
    )]
    pub pair: Box<Account<'info, Pair>>,

    #[account(mut)]
    pub token_a: Account<'info, token::Mint>,

    #[account(mut)]
    pub token_b: Account<'info, token::Mint>,

    pub system_program: Program<'info, System>,
}
