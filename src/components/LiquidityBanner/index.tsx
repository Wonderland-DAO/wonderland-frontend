import React, { useCallback, useState } from "react";
import "./liquidity-banner.scss";
import { ReactComponent as xIcon } from "../../assets/icons/x.svg";
import { SvgIcon } from "@material-ui/core";
import CircleIcon from "../../assets/icons/circle.svg";
import Volta from "../../assets/images/volta.png";
function LiquidityBanner() {
    const [showBanner, setShowBanner] = useState(true);

    const handleClose = useCallback(() => setShowBanner(false), []);

    if (!showBanner) {
        return null;
    }

    return (
        <div className="liquidity-banner-root">
            <div className="liquidity-banner-text-conteiner">
                <div className="liquidity-banner-left-gif">
                    <img src={Volta} />
                </div>
                <div className="liquidity-banner-right-gif">
                    <img src={Volta} />
                </div>
                <p className="liquidity-banner-text header">Migration to Volta is LIVE!</p>
                <p className="liquidity-banner-text">
                    Visit our new website{" "}
                    <a target="_blank" href="https://app.uniswap.org/#/swap?outputCurrency=0x3b79a28264fc52c7b4cea90558aa0b162f7faf57">
                        here
                    </a>{" "}
                    to migrate your wMEMO tokens.
                </p>
                <p className="liquidity-banner-text small">
                    Learn more in our article{" "}
                    <a target="_blank" href="https://app.uniswap.org/#/swap?outputCurrency=0x3b79a28264fc52c7b4cea90558aa0b162f7faf57">
                        here
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

export default LiquidityBanner;
