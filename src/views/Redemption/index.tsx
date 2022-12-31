import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { shorten } from "../../helpers";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { prettifySeconds, trim } from "src/helpers";
import { usePathForNetwork, useWeb3Context } from "src/hooks";
import { IReduxState } from "src/store/slices/state.interface";
import "./redemption.scss";
import wMemoIcon from "../../assets/tokens/MEMO.png";
import BridgeIcon from "../../assets/icons/bridge.svg";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/store/slices/pending-txns-slice";
import { Networks } from "src/constants";
import { changeApproval, changeSwap } from "src/store/slices/redemption-thunk";
import { BigNumber, ethers } from "ethers";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "src/constants/messages";
import moment from "moment";
import VotesList from "../../constants/jsons/votes.json";
import { IRedemptionTokens } from "src/store/slices/app-slice";

function Redemption() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { chainID, address, connect, checkWrongNetwork, provider } = useWeb3Context();

    usePathForNetwork({ pathName: "redemption", networkID: chainID, history });

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const wmemoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.wmemo;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const wMemoAllowance = useSelector<IReduxState, number>(state => {
        return state.account.redemption && state.account.redemption.wmemo;
    });

    const availableToClaim = useSelector<IReduxState, string>(state => {
        return state.account.redemptionClaim && state.account.redemptionClaim.avalable;
    });

    const wmemoStakedBalance = useSelector<IReduxState, string>(state => {
        return state.account.farm && state.account.farm.wmemo;
    });

    const redemptionTokens = useSelector<IReduxState, IRedemptionTokens[]>(state => {
        return state.app.redemptionTokens;
    });

    const redemptionDeadline = useSelector<IReduxState, number>(state => {
        return state.app && state.app.redemptionDeadline;
    });

    const hasAllowance = useCallback(() => (chainID === Networks.AVAX ? wMemoAllowance > 0 : true), [wMemoAllowance, chainID]);

    const trimmedWmemoBalance = trim(Number(wmemoBalance), 6);
    const trimmedAvailableToClaim = trim(Number(availableToClaim), 6);

    interface convertion {
        amount: string;
    }

    const [quantity, setQuantity] = useState<string>("");

    const handleSetQuantity = (amount: string) => {
        setQuantity(amount);
    };

    const setMax = () => {
        const amount = Number(availableToClaim) > Number(wmemoBalance) ? wmemoBalance : availableToClaim;
        handleSetQuantity(amount);
    };

    const onRedeem = async () => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: messages.before_redemption }));
        } else {
            await dispatch(changeSwap({ provider, networkID: chainID, value: quantity, address }));
            setQuantity("");
        }
    };

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, provider, networkID: chainID }));
    };

    const deadline = useMemo(() => {
        const now = Math.floor(Date.now() / 1000);
        if (!redemptionDeadline) return <Skeleton width="80px" />;
        if (redemptionDeadline - now > 0) return prettifySeconds(redemptionDeadline - now);
        return moment(redemptionDeadline).format("DD/MM/YYYY");
    }, [redemptionDeadline]);

    const inList = useMemo(() => !!VotesList.find(({ voter }) => voter.toLocaleLowerCase() === address.toLocaleLowerCase()), [address]);

    return (
        <div className="redemption-view">
            <Zoom in={true}>
                <div className="redemption-card">
                    <Grid className="redemption-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="redemption-card-header">
                                {parseFloat(wmemoStakedBalance) > 0 && parseFloat(trimmedWmemoBalance) < parseFloat(trimmedAvailableToClaim) ? (
                                    <>
                                        <p className="redemption-card-header-title">Redemption</p>
                                        <span className="redemption-card-header-title red">
                                            You have{" "}
                                            {new Intl.NumberFormat("en-US", {
                                                maximumFractionDigits: 6,
                                                minimumFractionDigits: 0,
                                            }).format(parseFloat(wmemoStakedBalance))}{" "}
                                            wMEMO in the Farm. Please unstake from the Farm prior to redeeming.
                                        </span>
                                    </>
                                ) : (
                                    <p className="redemption-card-header-title">Redemption</p>
                                )}
                            </div>
                        </Grid>

                        <div className="redemption-card-area">
                            {!address && (
                                <div className="redemption-card-wallet-notification">
                                    <div className="redemption-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="redemption-card-wallet-desc-text">Connect your wallet to redeem you wMEMO tokens!</p>
                                </div>
                            )}
                            {address && (
                                <>
                                    <div className="redemption-body-wrap">
                                        <div className="redemption-input-wrap">
                                            <p className="redemption-input-wrap-title">Redeem</p>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="redemption-input"
                                                value={quantity}
                                                onChange={e => handleSetQuantity(e.target.value)}
                                                labelWidth={0}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <div className="redemption-input-token-wrap">
                                                            <img className="redemption-input-token-wrap-logo" src={wMemoIcon} alt="" />
                                                            <p>wMEMO</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="redemption-input-btn">
                                                            <p>Max</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />
                                        </div>
                                        <div className="redemption-arrows">
                                            <img alt="" src={BridgeIcon} />
                                        </div>
                                        <div className="redemption-input-wrap">
                                            <p className="redemption-input-wrap-title">Receive</p>
                                            {redemptionTokens.map(({ exchangeRate, token }) => (
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="redemption-input"
                                                    value={(parseFloat(quantity) * exchangeRate).toFixed(2)}
                                                    labelWidth={0}
                                                    disabled
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <div className="redemption-input-token-wrap">
                                                                <img className="redemption-input-token-wrap-logo" src={token.img} alt="" />
                                                                <p>{token.name}</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            ))}
                                        </div>
                                        {inList ? (
                                            hasAllowance() ? (
                                                parseFloat(availableToClaim) > 0 ? (
                                                    <div
                                                        className="redemption-swap-button"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "redemption")) return;
                                                            onRedeem();
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "redemption", "Swap")}</p>
                                                    </div>
                                                ) : (
                                                    <div className="fully-redeemed">
                                                        <p>{txnButtonText(pendingTransactions, "approve_redemption", "Fully Redeemed")}</p>
                                                    </div>
                                                )
                                            ) : (
                                                <div
                                                    className="redemption-swap-button"
                                                    onClick={() => {
                                                        if (isPendingTxn(pendingTransactions, "approve_redemption")) return;
                                                        onSeekApproval();
                                                    }}
                                                >
                                                    <p>{txnButtonText(pendingTransactions, "approve_redemption", "Approve")}</p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="not-whitelisted">
                                                <p>{txnButtonText(pendingTransactions, "approve_redemption", "Address not Eligible for Redemption")}</p>
                                            </div>
                                        )}

                                        {inList ? (
                                            <div className="help-text">
                                                <p>...</p>
                                                <p>This action is irreversible; once you redeem you cannot convert back to wMEMO</p>
                                            </div>
                                        ) : (
                                            <div className="help-text red">
                                                <p>
                                                    You're connected using <span className="address">{shorten(address)}</span> which is not whitelisted.
                                                </p>
                                                <p>Please, verify you're using the correct address.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="redemption-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">Your Wallet Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedWmemoBalance} wMEMO</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Maximum Claimable Amount</p>
                                            <p className="data-row-value">
                                                {isAppLoading ? <Skeleton width="80px" /> : inList ? <>{trimmedAvailableToClaim} wMEMO</> : "Address not eligible for redemption"}
                                            </p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Rate</p>
                                            <p className="data-row-value">
                                                {isAppLoading ? (
                                                    <Skeleton width="80px" />
                                                ) : (
                                                    <div style={{ display: "flex" }}>
                                                        <p style={{ margin: "auto" }}>1 wMEMO = </p>
                                                        <div style={{ textAlign: "end", marginLeft: 5 }}>
                                                            {redemptionTokens.map(({ exchangeRate, token }) => (
                                                                <p>
                                                                    {new Intl.NumberFormat("en-US", {
                                                                        maximumFractionDigits: 0,
                                                                        minimumFractionDigits: 0,
                                                                    }).format(exchangeRate)}{" "}
                                                                    {token.name}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Deadline</p>
                                            <p className="data-row-value">{deadline}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Redemption;
