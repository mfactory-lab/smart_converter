use albus_solana_verifier::AlbusVerifier;
use anchor_lang::prelude::*;

use crate::state::{Pair, User};
use crate::utils::cmp_pubkeys;
use crate::{state::WhitelistedUserInfo, SmartConverterError};

/// The user may have access to use the smart-converter if he is in the whitelist,
/// or has a verified Proof Request via Albus program.
pub fn assert_authorized(
    pair: &Account<Pair>,
    user: &Account<User>,
    whitelisted_user_info: &AccountInfo,
    proof_request_account_info: Option<&AccountInfo>,
) -> Result<()> {
    if user.is_blocked {
        return Err(SmartConverterError::IsBlocked.into());
    }

    if !whitelisted_user_info.data_is_empty() {
        let mut data = &whitelisted_user_info
            .data
            .try_borrow_mut()
            .map_err(|_| SmartConverterError::Unauthorized)?[..];

        let info = WhitelistedUserInfo::try_deserialize(&mut data)?;

        if !cmp_pubkeys(&info.user, &user.authority) {
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
        if let Some(proof_request) = proof_request_account_info {
            msg!("User is not in whitelist! Trying to verify Proof request");
            AlbusVerifier::new(proof_request)
                .check_policy(policy)
                .check_owner(user.authority)
                .run()?;
        } else {
            msg!("User is not in whitelist! Proof request is not provided");
            return Err(SmartConverterError::Unauthorized.into());
        }
    }

    Ok(())
}
