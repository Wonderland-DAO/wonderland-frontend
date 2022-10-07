import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { useHistory } from "react-router-dom";
import { usePathForNetwork, useWeb3Context } from "../../hooks";
import { Networks } from "../../constants/blockchain";
import { getChainList } from "../../helpers/get-chains";
import SelectNetwork from "./components/SelectNetwork";

function Dashboard() {
    const history = useHistory();
    const { address, connect, chainID, providerChainID, checkWrongNetworkBalance, switchNetwork } = useWeb3Context();
    usePathForNetwork({ pathName: "dashboard", networkID: chainID, history });

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const timeBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.time;
    });
    const memoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.memo;
    });

    const wmemoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.wmemo;
    });

    const wmemoStakedBalance = useSelector<IReduxState, string>(state => {
        return state.account.farm && state.account.farm.wmemo;
    });

    const trimmedTimeBalance = trim(Number(timeBalance), 2);
    const trimmedMemoBalance = trim(Number(memoBalance), 2);
    const trimmedWmemoBalance = trim(Number(wmemoBalance), 6);
    const trimmedStakedWmemoBalance = trim(Number(wmemoStakedBalance), 6);

    const defaultToChain = useMemo(() => Number(getChainList(chainID)[0].chainId), [chainID]);

    const [toChain] = useState<Networks>(defaultToChain);

    const onNetworkSwap = (network?: Networks) => switchNetwork(network || toChain);

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <Zoom in={true}>
                    <Grid container spacing={4}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <div className="dashboard-card-header">
                                <p className="dashboard-card-header-title">Wonderland</p>
                            </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">wMEMO Price</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="100px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.wMemoMarketPrice)
                                    )}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Backing per $wMEMO</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="250px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.rfvWmemo)
                                    )}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Circulation</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="250px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.circSupply)
                                    )}
                                    <span className="card-value-sub wmemo"> wMEMO</span>
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Burned</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="250px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.burnSupply)
                                    )}
                                    <span className="card-value-sub wmemo"> wMEMO</span>
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Treasury Balance</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="250px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.treasuryBalance)
                                    )}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Market Cap</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="160px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.marketCap)
                                    )}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <div className="dashboard-card-header">
                                {providerChainID === Networks.AVAX ? (
                                    <p className="dashboard-card-header-title">
                                        Personal Balance <span className="small">Avalanche</span>
                                    </p>
                                ) : providerChainID === Networks.ETH ? (
                                    <p className="dashboard-card-header-title">
                                        Personal Balance <span className="small">Ethereum</span>
                                    </p>
                                ) : (
                                    <p className="dashboard-card-header-title"></p>
                                )}
                            </div>
                        </Grid>

                        {address && providerChainID === Networks.AVAX && (
                            <>
                                <Grid item lg={4} md={4} sm={4} xs={12}>
                                    <div className="dashboard-card">
                                        <p className="card-title">TIME Balance</p>
                                        <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : trimmedTimeBalance}</p>
                                    </div>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={12}>
                                    <div className="dashboard-card">
                                        <p className="card-title">MEMO Balance</p>
                                        <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : trimmedMemoBalance}</p>
                                    </div>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={12}>
                                    <div className="dashboard-card">
                                        <p className="card-title">wMEMO Balance</p>
                                        <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : trimmedWmemoBalance}</p>
                                    </div>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <div className="dashboard-card dashboard-farm">
                                        <p className="card-title">Farm Balance</p>
                                        <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : trimmedStakedWmemoBalance + " wMEMO"}</p>
                                    </div>
                                </Grid>
                            </>
                        )}
                        {address && providerChainID === Networks.ETH && (
                            <>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <div className="dashboard-card dashboard-farm">
                                        <p className="card-title">wMEMO</p>
                                        <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : trimmedWmemoBalance + " wMEMO"}</p>
                                    </div>
                                </Grid>
                            </>
                        )}
                        {!address && (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className="dashboard-card-wallet-notification">
                                    <div className="dashboard-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="dashboard-card-wallet-desc-text">Connect your wallet to view your portfolio!</p>
                                </div>
                            </Grid>
                        )}
                        {providerChainID !== Networks.AVAX && providerChainID !== Networks.ETH && (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className="dashboard-card-wallet-notification">
                                    <SelectNetwork network={chainID} from handleSelect={onNetworkSwap} />
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
