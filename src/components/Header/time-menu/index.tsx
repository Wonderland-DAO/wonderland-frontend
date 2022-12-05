import { useState } from "react";
import { Link, Fade, Popper } from "@material-ui/core";
import { time, memo, wmemo, swmemo } from "../../../helpers/tokens";
import "./time-menu.scss";

const baseUrl = "https://app.wonderland.money/";

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string, tokenImage: string, tokenDecimals: number) => async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: baseUrl + tokenImage,
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
};

function TimeMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isEthereumAPIAvailable = window.ethereum;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="time-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="time-menu-btn">
                <p>wMEMO</p>
            </div>

            <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link className="tooltip-item" href={"https://kyberswap.com/swap/avalanche/usdc-to-wmemo"} target="_blank">
                                <p>Buy on KyberSwap</p>
                            </Link>

                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="divider" />
                                    <p className="add-tokens-title">ADD TOKEN</p>
                                    <div className="divider" />
                                    <div className="tooltip-item" onClick={addTokenToWallet(wmemo.name, wmemo.address, wmemo.img, wmemo.decimals)}>
                                        <p>wMEMO</p>
                                    </div>
                                    <div className="tooltip-item" onClick={addTokenToWallet(memo.name, memo.address, memo.img, memo.decimals)}>
                                        <p>MEMO</p>
                                    </div>
                                    <div className="tooltip-item" onClick={addTokenToWallet(time.name, time.address, time.img, time.decimals)}>
                                        <p>TIME</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default TimeMenu;
export { addTokenToWallet };
