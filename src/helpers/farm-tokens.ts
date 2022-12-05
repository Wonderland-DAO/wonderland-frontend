import tokens, { mim, bsgg, usdc, spell } from "./tokens";

export default [...tokens];

export const EXCLUDED_TOKEN = [mim.address.toLocaleLowerCase()];
export const EXCLUDED_APR_TOKEN = [mim.address.toLocaleLowerCase()];
