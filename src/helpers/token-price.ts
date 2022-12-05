import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    // ! Load token prices from CoinGecko
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,betswap-gg,spell-token&vs_currencies=usd";
    const { data } = await axios.get(url);

    // cache["AVAX"] = data["avalanche-2"].usd;
    // cache["WAVAX"] = data["avalanche-2"].usd;
    // cache["MIM"] = data["magic-internet-money"].usd;
    // cache["WETH"] = data["weth"].usd;
    cache["BSGG"] = data["betswap-gg"].usd;
    // cache["WBTC"] = data["bitcoin"].usd;
    cache["SPELL"] = data["spell-token"].usd;

    // ! Load token prices from DexScreener
    // const spell = await axios.get("https://api.dexscreener.com/latest/dex/pairs/ethereum/0xb5de0c3753b6e1b4dba616db82767f17513e6d4e");
    // const bsgg = await axios.get("https://api.dexscreener.com/latest/dex/pairs/avalanche/0xcb178a279f9cd423e03ccaba921f80e82568fa32");

    // cache["SPELL"] = spell.data.pairs[0].priceUsd;
    // cache["BSGG"] = bsgg.data.pairs[0].priceUsd;
    cache["USDC.e"] = data["usd-coin"].usd * 1e12;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
