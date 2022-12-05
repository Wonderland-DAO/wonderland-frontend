import axios from "axios";
import { ethers } from "ethers";
import { Networks } from "../constants/blockchain";
import { wmemoMim } from "../helpers/bond";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getMainnetURI } from "../hooks/web3/helpers";
import { getAddresses } from "../constants/addresses";
import { wMemoTokenContract } from "../abi";

export async function getMarketPrice() {
    const uri = getMainnetURI(Networks.AVAX);
    const addresses = getAddresses(Networks.AVAX);
    const provider = new StaticJsonRpcProvider(uri);

    //! Deprecated
    // const pairContract = wmemoMim.getContractForReserve(Networks.AVAX, provider);
    // const reserves = await pairContract.getReserves();

    // const wMemoPrice = reserves[1] / reserves[0];

    //! Load token prices from DexScreener
    const url = "https://api.dexscreener.com/latest/dex/pairs/avalanche/0x024ba2110590dffa4d6b288761c5ee1e78e62cd4";
    const { data } = await axios.get(url);

    const wMemoPrice = data.pairs[0].priceUsd;

    const wMemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
    const timeValue = await wMemoContract.wMEMOToMEMO(ethers.utils.parseEther("1"));
    const timePrice = wMemoPrice / (timeValue * Math.pow(10, -9));

    return {
        wMemoPrice,
        timePrice,
    };
}
