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

    //! Load token prices from API
    //const url = "https://api.fanchy.xyz/v1/wonderland/tokens";
    //const { data } = await axios.get(url);
    //const marketPrice = data.wMEMO;

    //! Load token prices from API Ethereum Pair
    const url = "https://api.fanchy.xyz/v1/wonderland/price";
    const { data } = await axios.get(url);
    const marketPrice = data.priceUsd;

    return marketPrice;
}
