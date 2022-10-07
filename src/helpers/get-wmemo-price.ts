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
    const url = "https://api.dexscreener.com/latest/dex/pairs/avalanche/0xf93c610dd478d2e9fa47aa00ee3b726c6ac1c376";
    const { data } = await axios.get(url);
    const marketPrice = data.pairs[0].priceUsd;

    return marketPrice;
}
