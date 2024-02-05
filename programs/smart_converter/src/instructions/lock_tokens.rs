use anchor_lang::{prelude::*, system_program};
use anchor_spl::token;

use crate::{
    events::LockTokensEvent,
    state::{Admin, Manager, Pair, User},
    utils::assert_authorized,
    SmartConverterError,
};

/// The user can lock security tokens in special pair.
/// After that pair authority mints utility tokens to user.
pub fn handle(ctx: Context<LockTokens>, amount: u64) -> Result<()> {
    let admin = &ctx.accounts.admin;
    let manager = &ctx.accounts.manager;
    let user = &ctx.accounts.user;
    let pair = &mut ctx.accounts.pair;
    let pair_key = pair.key();

    if admin.is_platform_paused || manager.is_all_paused || pair.is_paused {
        return Err(SmartConverterError::IsPaused.into());
    }

    // Check if user have access to lock tokens
    assert_authorized(
        pair,
        user,
        &ctx.accounts.whitelisted_user_info,
        ctx.accounts.proof_request.as_ref(),
    )?;

    let user_authority = ctx.accounts.user_authority.key();

    if pair.lock_fee > 0 {
        let fee = amount
            .checked_div(1000)
            .ok_or(SmartConverterError::InsufficientFunds)?
            .checked_mul(pair.lock_fee as u64)
            .ok_or(SmartConverterError::InsufficientFunds)?;

        msg!("Transfer deposit fee: {} lamports", fee);

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.fee_payer.to_account_info(),
                    to: ctx.accounts.fee_receiver.to_account_info(),
                },
            ),
            fee,
        )
        .map_err(|_| SmartConverterError::InsufficientFunds)?;
    }

    // Transfer security token
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.source_a.to_account_info(),
                to: ctx.accounts.destination_a.to_account_info(),
                authority: ctx.accounts.user_authority.to_account_info(),
            },
        ),
        amount,
    )?;

    let pair_seeds = [pair_key.as_ref(), &[ctx.bumps.pair_authority]];

    // Mint utility tokens equals to `amount` * `ratio`
    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.token_b.to_account_info(),
                to: ctx.accounts.destination_b.to_account_info(),
                authority: ctx.accounts.pair_authority.to_account_info(),
            },
            &[&pair_seeds],
        ),
        amount * pair.ratio.num / pair.ratio.denom,
    )?;

    pair.locked_amount += amount;

    let clock = Clock::get()?;

    emit!(LockTokensEvent {
        pair: pair_key,
        user: user.key(),
        user_wallet: user_authority,
        amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct LockTokens<'info> {
    /// CHECK: safe, checked in Albus
    pub proof_request: Option<AccountInfo<'info>>,

    #[account(
        mut,
        seeds = [User::SEED, user_authority.key().as_ref()],
        bump,
        constraint = user.authority == user_authority.key(),
    )]
    pub user: Box<Account<'info, User>>,

    #[account(mut)]
    pub user_authority: Signer<'info>,

    #[account(
        mut,
        seeds = [Pair::SEED, token_a.key().as_ref(), token_b.key().as_ref()],
        bump,
        constraint = pair.authority == manager.authority,
    )]
    pub pair: Box<Account<'info, Pair>>,

    /// CHECK: no needs to check, only for signing
    #[account(seeds = [pair.key().as_ref()], bump)]
    pub pair_authority: AccountInfo<'info>,

    /// CHECK: will be checked in code
    pub whitelisted_user_info: AccountInfo<'info>,

    #[account(seeds = [Admin::SEED], bump)]
    pub admin: Box<Account<'info, Admin>>,

    pub manager: Box<Account<'info, Manager>>,

    #[account(mut)]
    pub token_a: Box<Account<'info, token::Mint>>,

    #[account(mut)]
    pub token_b: Box<Account<'info, token::Mint>>,

    #[account(
        mut,
        associated_token::mint = token_a,
        associated_token::authority = user_authority,
    )]
    pub source_a: Account<'info, token::TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token_a,
        associated_token::authority = pair_authority,
    )]
    pub destination_a: Account<'info, token::TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token_b,
        associated_token::authority = user_authority,
    )]
    pub destination_b: Account<'info, token::TokenAccount>,

    #[account(mut)]
    pub fee_payer: Signer<'info>,

    /// CHECK: no needs to check, only for transfer
    #[account(mut, address = pair.fee_receiver)]
    pub fee_receiver: AccountInfo<'info>,

    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
}
