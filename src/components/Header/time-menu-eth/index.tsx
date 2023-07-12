import { useState } from "react";
import { Link, Fade, Popper } from "@material-ui/core";
import { wmemomainnet } from "../../../helpers/tokens";
import "./time-menu.scss";

const baseUrl = "https://app.wonderland.money/";

const addTokenToWalletMainnet = (tokenSymbol: string, tokenAddress: string, tokenImage: string, tokenDecimals: number) => async () => {
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

function TimeMenuMainnet() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isEthereumAPIAvailable = window.ethereum;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="time-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="time-menu-btn">
                <p>Buy</p>
            </div>

            <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link className="tooltip-item" href={"https://app.uniswap.org/#/swap?outputCurrency=0x3b79a28264fc52c7b4cea90558aa0b162f7faf57"} target="_blank">
                                <p>Buy on Uniswap</p>
                            </Link>

                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="divider" />
                                    <p className="add-tokens-title">ADD TOKEN</p>
                                    <div className="divider" />
                                    <div
                                        className="tooltip-item"
                                        onClick={addTokenToWalletMainnet(wmemomainnet.name, wmemomainnet.address, wmemomainnet.img, wmemomainnet.decimals)}
                                    >
                                        <p>wMEMO</p>
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

export default TimeMenuMainnet;
export { addTokenToWalletMainnet };
