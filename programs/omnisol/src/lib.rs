pub mod events;
pub mod instructions;
pub mod state;
mod utils;

use anchor_lang::prelude::*;

use crate::instructions::*;

declare_id!("DMG9gp5VHPVpA3bst6yhC4L4D4aZiUjUTibVQGvJzpjy");

#[program]
pub mod omnisol {
    use super::*;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized action")]
    Unauthorized,
}
