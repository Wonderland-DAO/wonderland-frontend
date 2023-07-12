import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    // ! Load token prices from CoinGecko
    const url = "https://api.fanchy.xyz/v1/wonderland/tokens";
    const { data } = await axios.get(url);

    for (const token in data) {
        cache[token] = data[token];
    }
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
