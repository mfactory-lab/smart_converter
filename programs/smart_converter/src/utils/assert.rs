use albus_solana_verifier::AlbusVerifier;
use anchor_lang::prelude::*;

use crate::state::{Pair, User};
use crate::utils::cmp_pubkeys;
use crate::{state::WhitelistedUserInfo, SmartConverterError};

/// The user may have access to use the smart-converter if he is in the whitelist,
/// or has a verified Proof Request via Albus program.
pub fn assert_authorized(
    pair: &Account<Pair>,
    user_address: &Pubkey,
    user_account: &AccountInfo,
    whitelist_account: &AccountInfo,
    proof_request_account: Option<&AccountInfo>,
) -> Result<()> {
    // User account exists
    if !user_account.data_is_empty() {
        let mut data = &user_account
            .data
            .try_borrow_mut()
            .map_err(|_| SmartConverterError::Unauthorized)?[..];

        let user = User::try_deserialize(&mut data)?;

        if user.is_blocked {
            return Err(SmartConverterError::IsBlocked.into());
        }
    }

    // Whitelist account exists
    if !whitelist_account.data_is_empty() {
        let mut data = &whitelist_account
            .data
            .try_borrow_mut()
            .map_err(|_| SmartConverterError::Unauthorized)?[..];

        let info = WhitelistedUserInfo::try_deserialize(&mut data)?;

        if !cmp_pubkeys(&info.user, &user_address) {
            msg!("Error: Invalid whitelisted user account");
            return Err(SmartConverterError::Unauthorized.into());
        }

        if !cmp_pubkeys(&info.pair, &pair.key()) {
            msg!("Error: Invalid whitelisted user account");
            return Err(SmartConverterError::Unauthorized.into());
        }

        return Ok(());
    }

    if let Some(policy) = pair.policy {
        if let Some(proof_request) = proof_request_account {
            msg!("User is not in whitelist! Trying to verify Proof request");
            AlbusVerifier::new(proof_request)
                .check_policy(policy)
                .check_owner(*user_address)
                .run()?;
        } else {
            msg!("User is not in whitelist! Proof request is not provided");
            return Err(SmartConverterError::Unauthorized.into());
        }
    }

    Ok(())
}
