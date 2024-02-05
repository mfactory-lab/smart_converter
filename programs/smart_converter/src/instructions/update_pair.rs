use anchor_lang::prelude::*;

use crate::{
    state::{Pair, Ratio},
    utils, SmartConverterError,
};

/// The manager can remove pair.
pub fn remove(ctx: Context<UpdatePair>) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    if pair.locked_amount > 0 {
        msg!("Please, wait until all tokens will be unlocked");
        return Err(SmartConverterError::StillRemainingLockedTokens.into());
    }

    // close the pair account
    utils::close_account(
        pair.to_account_info(),
        ctx.accounts.authority.to_account_info(),
    )?;

    Ok(())
}

/// The manager can update pair.
pub fn update(ctx: Context<UpdatePair>, data: UpdatePairData) -> Result<()> {
    let pair = &mut ctx.accounts.pair;

    if let Some(is_paused) = data.is_paused {
        pair.is_paused = is_paused;
    }

    if let Some(authority) = data.new_authority {
        pair.authority = authority;
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
    new_authority: Option<Pubkey>,
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

    #[account(mut, has_one = authority)]
    pub pair: Box<Account<'info, Pair>>,

    pub system_program: Program<'info, System>,
}
