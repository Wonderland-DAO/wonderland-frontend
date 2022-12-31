import { ethers } from "ethers";
import { getAddresses, WONDERLAND_API } from "../../constants";
import { StakingContract, RedemptionAbi, MemoTokenContract, StableReserveContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import { Networks } from "../../constants/blockchain";
import { error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getFundTotal } from "../../helpers/get-fund-total";
import { IData } from "src/hooks/types";
import { IToken } from "../../helpers/tokens";
import axios from "axios";
import redemptionTokens from "src/helpers/redemption-tokens";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
    checkWrongNetwork: () => Promise<boolean>;
}

export const loadAppDetails = createAsyncThunk("app/loadAppDetails", async ({ networkID, provider, checkWrongNetwork }: ILoadAppDetails, { dispatch }): Promise<any> => {
    try {
        await provider.getBlockNumber();
    } catch (err) {
        console.log(err);
        dispatch(error({ text: messages.rpc_connection_lost }));
        checkWrongNetwork();
    }

    const { wMemoPrice } = await getMarketPrice();
    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const { zapper } = await getFundTotal();
    const stats = await (await axios.get(WONDERLAND_API)).data;
    const treasury = stats.treasury.illiquid;
    const burned = stats.token.burnedSupply.total;
    const circulation = stats.token.circulatingSupply;
    // const totalSupply = stats.token.totalSupply;
    const rfvWmemo = treasury / circulation;
    const marketCap = circulation * wMemoPrice;

    if (networkID !== Networks.AVAX) {
        return {
            wMemoMarketPrice: wMemoPrice,
            treasuryBalance: treasury,
            currentBlock,
            currentBlockTime,
            zapper,
            marketCap,
            rfvWmemo,
            circSupply: circulation,
            burnSupply: burned,
        };
    }

    const addresses = getAddresses(networkID);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);

    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await memoContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endTime;

    const redemptionTokenAddresses: string[] = [];

    const redemptionContract = new ethers.Contract(addresses.REDEMPTION_ADDRESS, RedemptionAbi, provider);
    const redemptionTokensLength = await redemptionContract.redemptionTokensLength();

    for (let i = 0; i < redemptionTokensLength; i++) {
        const address = await redemptionContract.redemptionTokens(i);
        redemptionTokenAddresses.push(address);
    }

    const rawTokens = await Promise.all(redemptionTokenAddresses.map(async token => [token, await redemptionContract.exchangeRates(token)]));
    const tokens = await Promise.all(rawTokens.map((reward: string[]) => exchangeRate(reward[0], reward[1], provider)));

    const redemptionDeadline = await redemptionContract.redemptionStop();

    return {
        currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")) / 4.5,
        marketCap,
        currentBlock,
        fiveDayRate,
        treasuryBalance: treasury,
        stakingAPY,
        circSupply: circulation,
        burnSupply: burned,
        // stakingTVL,
        stakingRebase,
        currentBlockTime,
        nextRebase,
        wMemoMarketPrice: wMemoPrice,
        rfvWmemo,
        zapper,
        redemptionTokens: tokens,
        redemptionDeadline,
    };
});

const initialState = {
    loading: true,
};

export interface IRedemptionTokens {
    exchangeRate: number;
    token: IToken;
}

async function exchangeRate(tokenAddress: string, amount: string, provider: StaticJsonRpcProvider | JsonRpcProvider): Promise<IRedemptionTokens> {
    let token = redemptionTokens.find(_token => _token.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase());

    if (!token) {
        const tokenContract = new ethers.Contract(tokenAddress, StableReserveContract, provider);
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        token = {
            name: symbol,
            decimals,
            address: tokenAddress,
            img: "",
        };
    }

    return {
        exchangeRate: Number(amount) / Math.pow(10, token.decimals),
        token: JSON.parse(JSON.stringify(token)),
    };
}

export interface IZapperData {
    wallet: IData[];
    vaults: IData[];
    leveragedPosition: IData[];
    liquidityPool: IData[];
    claimable: IData[];
    debt: IData[];
    farm: IData[];
}

export interface IAppSlice {
    loading: boolean;
    stakingTVL: number;
    marketPrice: number;
    wMemoMarketPrice: number;
    marketCap: number;
    circSupply: number;
    burnSupply: number;
    currentIndex: string;
    currentBlock: number;
    currentBlockTime: number;
    fiveDayRate: number;
    treasuryBalance: number;
    stakingAPY: number;
    stakingRebase: number;
    nextRebase: number;
    totalSupply: number;
    rfvWmemo: number;
    zapper: IZapperData;
    redemptionTokens: IRedemptionTokens[];
    redemptionDeadline: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
