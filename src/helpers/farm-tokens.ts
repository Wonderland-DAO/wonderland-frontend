import tokens, { mim, bsgg, usdc } from "./tokens";

export default [...tokens];

export const EXCLUDED_TOKEN = [mim.address.toLocaleLowerCase(), usdc.address.toLocaleLowerCase()];
export const EXCLUDED_APR_TOKEN = [mim.address.toLocaleLowerCase(), bsgg.address.toLocaleLowerCase(), usdc.address.toLocaleLowerCase()];
