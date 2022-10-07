import tokens, { mim, bsgg } from "./tokens";

export default [...tokens];

export const EXCLUDED_TOKEN = [mim.address.toLocaleLowerCase()];
export const EXCLUDED_APR_TOKEN = [mim.address.toLocaleLowerCase(), bsgg.address.toLocaleLowerCase()];
