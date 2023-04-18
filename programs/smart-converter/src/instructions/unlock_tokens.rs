use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{state::{Manager, Admin, Pair, User}, ErrorCode, utils};

/// The user can unlock security tokens in special pair.
/// After that user burns utility tokens and gets locked tokens back.
pub fn handle(ctx: Context<UnlockTokens>, amount: u64) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let manager = &mut ctx.accounts.manager;
    let admin = &mut ctx.accounts.admin;
    let pair = &mut ctx.accounts.pair;

    let pair_key = pair.key();
    let pair_authority_seeds = [pair_key.as_ref(), &[ctx.bumps["pair_authority"]]];

    if admin.is_platform_paused || manager.is_all_paused || pair.is_paused {
        return Err(ErrorCode::IsPaused.into());
    }

    if user.is_blocked {
        return Err(ErrorCode::IsBlocked.into());
    }

    if user.locked_amount < amount {
        return Err(ErrorCode::InsufficientLockedAmount.into());
    }

    // Burn utility tokens equals to `amount` * `ratio`
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Burn {
                mint: ctx.accounts.token_b.to_account_info(),
                from: ctx.accounts.source_b.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount * pair.ratio.num / pair.ratio.denom,
    )?;

    // Transfer security token
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.source_a.to_account_info(),
                to: ctx.accounts.destination_a.to_account_info(),
                authority: ctx.accounts.pair_authority.to_account_info(),
            },
            &[&pair_authority_seeds],
        ),
        amount,
    )?;

    user.locked_amount -= amount;
    pair.locked_amount -= amount;

    if user.locked_amount == 0 {
        // close the user account
        utils::close(user.to_account_info(), ctx.accounts.authority.to_account_info())?;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct UnlockTokens<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [User::SEED, authority.key().as_ref()],
        bump,
    )]
    pub user: Box<Account<'info, User>>,

    #[account(
        mut,
        seeds = [Pair::SEED, token_a.key().as_ref(), token_b.key().as_ref()],
        bump,
        constraint = pair.manager_wallet == manager_wallet.key(),
    )]
    pub pair: Box<Account<'info, Pair>>,

    #[account(
        seeds = [Manager::SEED, manager_wallet.key().as_ref()],
        bump,
    )]
    pub manager: Box<Account<'info, Manager>>,

    #[account(
        seeds = [Admin::SEED],
        bump,
    )]
    pub admin: Box<Account<'info, Admin>>,

    /// CHECK: no needs to check, only for signing
    #[account(seeds = [pair.key().as_ref()], bump)]
    pub pair_authority: AccountInfo<'info>,

    /// CHECK: Address of manager's wallet to check
    pub manager_wallet: AccountInfo<'info>,

    #[account(mut)]
    pub token_a: Account<'info, token::Mint>,

    #[account(mut)]
    pub token_b: Account<'info, token::Mint>,

    #[account(
        mut,
        associated_token::mint = token_a,
        associated_token::authority = pair_authority,
    )]
    pub source_a: Account<'info, token::TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token_a,
        associated_token::authority = authority,
    )]
    pub destination_a: Account<'info, token::TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token_b,
        associated_token::authority = authority,
    )]
    pub source_b: Account<'info, token::TokenAccount>,

    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
}
