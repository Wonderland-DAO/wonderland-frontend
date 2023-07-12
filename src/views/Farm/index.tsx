import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathForNetwork, useWeb3Context } from "../../hooks";
import { Grid, InputAdornment, OutlinedInput, Zoom, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./farm.scss";
import { IReduxState } from "../../store/slices/state.interface";
import { Skeleton } from "@material-ui/lab";
import { trim } from "../../helpers";
import classnames from "classnames";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import Wrap from "../../components/Wrap";
import MemoIcon from "../../assets/tokens/MEMO.png";
import Accordion from "../../components/Accordion";
import { changeApproval, changeStake, getReward, exitFarm } from "../../store/slices/farm-thunk";
import { ITokenReward, IUserRewardsDetail } from "../../store/slices/account-slice";
import { warning } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useHistory } from "react-router-dom";
import { addTokenToWallet } from "../../components/Header/time-menu";
import WalletIcon from "../../assets/icons/add-wallet.svg";

function Farm() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    const history = useHistory();
    usePathForNetwork({ pathName: "farm", networkID: chainID, history });

    const [view, setView] = useState(1);
    const [wrapOpen, setWrapOpen] = useState(false);
    const [quantity, setQuantity] = useState<string>("");

    const allowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.wmemo;
    });

    const wmemoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.wmemo;
    });

    const wmemoStakedBalance = useSelector<IReduxState, string>(state => {
        return state.account.farm && state.account.farm.wmemo;
    });

    const wmemoToWithdraw = parseFloat(wmemoStakedBalance);

    const rewards = useSelector<IReduxState, IUserRewardsDetail[]>(state => {
        return state.account.rewards;
    });

    const totalUserRewards = useSelector<IReduxState, number>(state => {
        return state.account.totalUserRewards;
    });

    const tokenAprRewards = useSelector<IReduxState, ITokenReward[]>(state => {
        return state.account.tokenRewards;
    });

    const farmApr = useSelector<IReduxState, number>(state => {
        return state.account.farmApr;
    });

    const isWrapShow = useMediaQuery("(max-width: 480px)");

    const handleWrapOpen = () => {
        setWrapOpen(true);
    };

    const handleWrapClose = () => {
        setWrapOpen(false);
    };

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    const setMax = () => {
        if (view === 0) {
            setQuantity(wmemoBalance);
        } else {
            setQuantity(wmemoStakedBalance);
        }
    };

    const hasAllowance = useCallback(() => allowance > 0, [allowance]);

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, provider, networkID: chainID }));
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
        } else {
            await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
            setQuantity("");
        }
    };

    const useStyles = makeStyles({
        tooltip: {
            fontSize: "0.9em",
        },
    });

    const classes = useStyles();

    const onHarvest = async () => {
        if (await checkWrongNetwork()) return;

        await dispatch(getReward({ address, provider, networkID: chainID }));
    };

    const onExit = async () => {
        if (await checkWrongNetwork()) return;

        await dispatch(exitFarm({ address, provider, networkID: chainID }));
    };

    const wmemoTotalFarmStaked = useSelector<IReduxState, string>(state => {
        return state.account.wmemoTotalFarmStaked;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const trimmedStakedTotalwMemo = trim(Number(wmemoTotalFarmStaked), 6);

    const isEthereumAPIAvailable = window.ethereum;

    return (
        <div className="farm-view">
            <Zoom in={true}>
                <div className="farm-card">
                    <Grid className="farm-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="farm-card-header">
                                <p className="farm-card-header-title">Farm</p>

                                {isWrapShow && (
                                    <div onClick={handleWrapOpen} className="farm-card-wrap-btn">
                                        <p>Wrap</p>
                                    </div>
                                )}
                            </div>
                            <Wrap open={wrapOpen} handleClose={handleWrapClose} />
                        </Grid>
                    </Grid>

                    <Grid item>
                        <div className="farm-card-metrics">
                            <Grid container spacing={0}>
                                <Grid item xs={12} sm={12}>
                                    <div className="farm-card-tvl">
                                        {/* <p className="farm-card-metrics-title">Total APR</p>
                                        <p className="farm-card-metrics-value">
                                            {farmApr ? (
                                                <>{new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(farmApr)}%</>
                                            ) : (
                                                <Skeleton width="150px" />
                                            )}
                                        </p> */}
                                        <p className="farm-card-metrics-title">The Farm is paused</p>
                                    </div>
                                </Grid>

                                {/* <Grid item xs={12} sm={6}>
                                    <div className="farm-card-tvl">
                                        <p className="farm-card-metrics-title">Staked wMEMO</p>
                                        <p className="farm-card-metrics-value">
                                            {!trimmedStakedTotalwMemo ? (
                                                <Skeleton width="150px" />
                                            ) : (
                                                <>
                                                    {new Intl.NumberFormat("en-US", {
                                                        maximumFractionDigits: 6,
                                                        minimumFractionDigits: 6,
                                                    }).format(Number(wmemoTotalFarmStaked))}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </Grid> */}
                            </Grid>
                        </div>
                    </Grid>

                    <div className="farm-card-area">
                        {!address && (
                            <div className="farm-card-wallet-notification">
                                <div className="farm-card-wallet-connect-btn" onClick={connect}>
                                    <p>Connect Wallet</p>
                                </div>
                                <p className="farm-card-wallet-desc-text">Connect your wallet to stake wMEMO tokens!</p>
                            </div>
                        )}
                        {address && (wmemoToWithdraw > 0 || rewards.length > 0) && (
                            <div>
                                <div className="farm-card-action-area">
                                    <div className="farm-card-action-stage-btns-wrap">
                                        {/* <div onClick={changeView(0)} className={classnames("farm-card-action-stage-btn", { active: !view })}>
                                            <p>Stake</p>
                                        </div>
                                        <div onClick={changeView(1)} className={classnames("farm-card-action-stage-btn", { active: view })}>
                                            <p>Unstake</p>
                                        </div> */}
                                    </div>

                                    <div className="farm-card-action-row">
                                        <OutlinedInput
                                            type="number"
                                            placeholder="Amount"
                                            className="farm-card-action-input"
                                            value={quantity}
                                            onChange={e => setQuantity(e.target.value)}
                                            labelWidth={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div onClick={setMax} className="farm-card-action-input-btn">
                                                        <p>Max</p>
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />

                                        {view === 0 && (
                                            <div className="farm-card-tab-panel">
                                                {address && hasAllowance() ? (
                                                    <div
                                                        className="farm-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "farm_staking")) return;
                                                            onChangeStake("stake");
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "farm_staking", "Stake wMEMO")}</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="farm-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "approve_farm")) return;
                                                            onSeekApproval();
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "approve_farm", "Approve")}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {view === 1 && (
                                            <div className="farm-card-tab-panel">
                                                <div
                                                    className="farm-card-tab-panel-btn"
                                                    onClick={() => {
                                                        if (isPendingTxn(pendingTransactions, "farm_unstaking")) return;
                                                        onChangeStake("unstake");
                                                    }}
                                                >
                                                    <p>{txnButtonText(pendingTransactions, "farm_unstaking", "Unstake wMEMO")}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="farm-card-action-help-text">
                                        {address && !hasAllowance() && (
                                            <p>
                                                Note: The "Approve" transaction is only needed when staking/unstaking for the first time; subsequent staking/unstaking only requires
                                                you to perform the "Stake" or "Unstake" transaction.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="farm-user-data">
                                    <div className="farm-staked-balance-wrap">
                                        <div className="farm-token-img">
                                            <img alt="" src={MemoIcon} />
                                        </div>
                                        <p className="farm-staked-balance-title">Your Staked wMEMO</p>
                                        <p className="farm-staked-balance-value">
                                            {new Intl.NumberFormat("en-US", {
                                                maximumFractionDigits: 6,
                                                minimumFractionDigits: 0,
                                            }).format(Number(wmemoStakedBalance))}
                                        </p>
                                    </div>
                                    {/* <Accordion title="Projected pool APR">
                                        <div>
                                            {tokenAprRewards.map(({ yieldWeek, token }) => (
                                                <div className="farm-token-wrap">
                                                    {token.img && (
                                                        <div className="farm-token-img">
                                                            <img alt="" src={token.img} />
                                                        </div>
                                                    )}
                                                    <p className="farm-token-title">{token.name}</p>
                                                    <p className="farm-token-value">
                                                        {new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(yieldWeek)}%
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </Accordion> */}
                                    {rewards.length > 0 && (
                                        <>
                                            <Accordion title="Your farm rewards">
                                                <div>
                                                    {rewards.map(({ balance, value, token }) => (
                                                        <div className="farm-token-wrap">
                                                            {token.img && (
                                                                <div className="farm-token-img">
                                                                    <img alt="" src={token.img} />
                                                                </div>
                                                            )}
                                                            <p className="farm-token-title">
                                                                {token.name}
                                                                {isEthereumAPIAvailable && (
                                                                    <Tooltip
                                                                        classes={{ tooltip: classes.tooltip }}
                                                                        placement="right"
                                                                        title={"Add " + token.name + " to Web3 Wallet!"}
                                                                    >
                                                                        <img
                                                                            alt=""
                                                                            src={WalletIcon}
                                                                            onClick={addTokenToWallet(token.name, token.address, token.img, token.decimals)}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </p>
                                                            <p className="farm-token-value">
                                                                {new Intl.NumberFormat("en-US", {
                                                                    maximumFractionDigits: token.decimals / 3,
                                                                    minimumFractionDigits: 0,
                                                                }).format(balance)}
                                                                {" ("}
                                                                {value > 1
                                                                    ? new Intl.NumberFormat("en-US", {
                                                                          style: "currency",
                                                                          currency: "USD",
                                                                          maximumFractionDigits: 0,
                                                                          minimumFractionDigits: 0,
                                                                      }).format(value)
                                                                    : new Intl.NumberFormat("en-US", {
                                                                          style: "currency",
                                                                          currency: "USD",
                                                                          maximumFractionDigits: 2,
                                                                          minimumFractionDigits: 0,
                                                                      }).format(value)}
                                                                {")"}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Accordion>
                                            <div className="farm-reward-balance-wrap">
                                                <p className="farm-reward-balance-title">Total Rewards</p>
                                                <p className="farm-reward-balance-value">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 2,
                                                        minimumFractionDigits: 0,
                                                    }).format(Number(totalUserRewards))}
                                                </p>
                                            </div>

                                            <Grid container>
                                                <Grid item xs={12} sm={12}>
                                                    <div className="farm-harvest-wrap">
                                                        <div
                                                            className="farm-harvest-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "farm_harvest")) return;
                                                                onHarvest();
                                                            }}
                                                        >
                                                            <p>Claim Rewards</p>
                                                        </div>
                                                        <Tooltip classes={{ tooltip: classes.tooltip }} placement="top" title={"Withdraw your wMEMO & Claim Rewards"}>
                                                            <div
                                                                className="farm-exit-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "exit_farm")) return;
                                                                    onExit();
                                                                }}
                                                            >
                                                                <p>Exit</p>
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Zoom>
        </div>
    );
}

export default Farm;
