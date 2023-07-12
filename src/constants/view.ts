import { Networks } from "./blockchain";
import { redemptionStatus, redemptionPeriodStart, redemptionPeriodEnd } from "./redemption";

interface IViewsForNetwork {
    dashboard: boolean;
    stake: boolean;
    mints: boolean;
    calculator: boolean;
    farm: boolean;
    redemption: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
    [Networks.ETH]: {
        dashboard: true,
        stake: false,
        mints: false,
        calculator: false,
        farm: false,
        redemption: false,
    },
    [Networks.AVAX]: {
        dashboard: true,
        stake: false,
        mints: false,
        calculator: false,
        farm: true,
        redemption: redemptionStatus || (redemptionPeriodStart < Date.now() && redemptionPeriodEnd > Date.now()) ? true : false,
    },
    // [Networks.FANTOM]: {
    //     dashboard: true,
    //     stake: false,
    //     mints: false,
    //     calculator: false,
    //     farm: false,
    //     redemption: false,
    // },
    // [Networks.AETH]: {
    //     dashboard: true,
    //     stake: false,
    //     mints: false,
    //     calculator: false,
    //     farm: false,
    //     redemption: false,
    // },
};
