use albus_verifier::check_compliant;
use anchor_lang::prelude::*;

use crate::{id, state::WhitelistedUserInfo};

/// The user may have access to use the smart-converter if he is in the whitelist, or has a verified ZKP request via Albus program.
pub fn verify(
    whitelisted_user_info: AccountInfo,
    zkp_request: AccountInfo,
    user_wallet: Pubkey,
    pair_key: Pubkey,
) -> Result<()> {
    let (whitelisted_user_address, _) = Pubkey::find_program_address(
        &[WhitelistedUserInfo::SEED, user_wallet.as_ref(), pair_key.as_ref()],
        &id(),
    );

    if whitelisted_user_address != whitelisted_user_info.key() {
        return Err(ErrorCode::ConstraintSeeds.into());
    }

    let mut whitelisted_user_data = &whitelisted_user_info
        .data
        .try_borrow_mut()
        .map_err(|_| ErrorCode::AccountDidNotDeserialize)?[..];
    let whitelisted_user_info: WhitelistedUserInfo = WhitelistedUserInfo::try_deserialize(&mut whitelisted_user_data)?;

    if whitelisted_user_info.user_wallet != user_wallet || whitelisted_user_info.pair != pair_key {
        check_compliant(&zkp_request, Some(user_wallet))?
    }

    Ok(())
}
