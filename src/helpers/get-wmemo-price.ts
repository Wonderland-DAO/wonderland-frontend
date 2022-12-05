import axios from "axios";
import { Networks } from "../constants/blockchain";
import { wmemoMim } from "../helpers/bond";
import { simpleProvider } from "./simpleProvider";

export async function getWmemoMarketPrice(): Promise<number> {
    //! Deprecated
    // const provider = simpleProvider(Networks.AVAX);

    // const pairContract = wmemoUsdc.getContractForReserve(Networks.AVAX, provider);
    // const reserves = await pairContract.getReserves();

    // const marketPrice = reserves[1] / reserves[0];

    //! Load token prices from DexScreener
    const url = "https://api.dexscreener.com/latest/dex/pairs/avalanche/0x024ba2110590dffa4d6b288761c5ee1e78e62cd4";
    const { data } = await axios.get(url);
    const marketPrice = data.pairs[0].priceUsd;

    return marketPrice;
}
