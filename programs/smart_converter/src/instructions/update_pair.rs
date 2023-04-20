use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    state::{Manager, Pair, Ratio},
    utils, ErrorCode,
};

/// The manager can remove pair.
pub fn remove(ctx: Context<UpdatePair>) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    if pair.locked_amount > 0 {
        msg!("Please, wait until all tokens will be unlocked");
        return Err(ErrorCode::StillRemainingLockedTokens.into());
    }

    // close the pair account
    utils::close(pair.to_account_info(), ctx.accounts.authority.to_account_info())?;

    Ok(())
}

/// The manager can update pair.
pub fn update(ctx: Context<UpdatePair>, data: UpdatePairData) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    if let Some(is_paused) = data.is_paused {
        pair.is_paused = is_paused;
    }

    if let Some(manager_wallet) = data.manager_wallet {
        pair.manager_wallet = manager_wallet;
    }

    if let Some(ratio) = data.ratio {
        pair.ratio = ratio
    }

    if let Some(lock_fee) = data.lock_fee {
        pair.lock_fee = lock_fee
    }

    if let Some(unlock_fee) = data.unlock_fee {
        pair.unlock_fee = unlock_fee
    }

    if let Some(fee_receiver) = data.fee_receiver {
        pair.fee_receiver = fee_receiver
    }

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdatePairData {
    manager_wallet: Option<Pubkey>,
    is_paused: Option<bool>,
    ratio: Option<Ratio>,
    lock_fee: Option<u16>,
    unlock_fee: Option<u16>,
    fee_receiver: Option<Pubkey>,
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
