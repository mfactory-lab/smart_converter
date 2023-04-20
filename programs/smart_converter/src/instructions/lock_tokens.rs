use anchor_lang::{prelude::*, system_program};
use anchor_spl::token;

use crate::{
    events::LockTokensEvent,
    state::{Admin, Manager, Pair, User, WhitelistedUserInfo},
    ErrorCode,
};

/// The user can lock security tokens in special pair.
/// After that pair authority mints utility tokens to user.
pub fn handle(ctx: Context<LockTokens>, amount: u64) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let whitelisted_user_info = &mut ctx.accounts.whitelisted_user_info;
    let manager = &mut ctx.accounts.manager;
    let admin = &mut ctx.accounts.admin;
    let pair = &mut ctx.accounts.pair;
    let clock = &ctx.accounts.clock;

    let user_wallet = ctx.accounts.authority.key();
    let pair_key = pair.key();
    let pair_authority_seeds = [pair_key.as_ref(), &[ctx.bumps["pair_authority"]]];

    if admin.is_platform_paused || manager.is_all_paused || pair.is_paused {
        return Err(ErrorCode::IsPaused.into());
    }

    if user.is_blocked {
        return Err(ErrorCode::IsBlocked.into());
    }

    if pair.lock_fee > 0 {
        let fee = amount.saturating_div(1000).saturating_mul(pair.lock_fee as u64);
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
        .map_err(|_| ErrorCode::InsufficientFunds)?;
    }

    // Transfer security token
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.source_a.to_account_info(),
                to: ctx.accounts.destination_a.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;

    // Mint utility tokens equals to `amount` * `ratio`
    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.token_b.to_account_info(),
                to: ctx.accounts.destination_b.to_account_info(),
                authority: ctx.accounts.pair_authority.to_account_info(),
            },
            &[&pair_authority_seeds],
        ),
        amount * pair.ratio.num / pair.ratio.denom,
    )?;

    whitelisted_user_info.locked_amount += amount;
    pair.locked_amount += amount;

    emit!(LockTokensEvent {
        pair: pair_key,
        user: user.key(),
        user_wallet: user_wallet,
        amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct LockTokens<'info> {
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
        seeds = [WhitelistedUserInfo::SEED, authority.key().as_ref(), pair.key().as_ref()],
        bump,
    )]
    pub whitelisted_user_info: Box<Account<'info, WhitelistedUserInfo>>,

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
    pub token_a: Box<Account<'info, token::Mint>>,

    #[account(mut)]
    pub token_b: Box<Account<'info, token::Mint>>,

    #[account(
        mut,
        associated_token::mint = token_a,
        associated_token::authority = authority,
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
        associated_token::authority = authority,
    )]
    pub destination_b: Account<'info, token::TokenAccount>,

    #[account(mut)]
    pub fee_payer: Signer<'info>,

    /// CHECK: no needs to check, only for transfer
    #[account(mut, address = pair.fee_receiver)]
    pub fee_receiver: AccountInfo<'info>,

    pub clock: Sysvar<'info, Clock>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
}
