import React, { useCallback, useState } from "react";
import "./liquidity-banner.scss";
import { ReactComponent as xIcon } from "../../assets/icons/x.svg";
import { SvgIcon } from "@material-ui/core";
import { redemptionPeriodStart, redemptionPeriodEnd } from "../../constants/redemption";
import CircleIcon from "../../assets/icons/circle.svg";
import RainGif from "../../assets/gifs/rain.gif";
import BagGif from "../../assets/gifs/bag.gif";

function LiquidityBanner() {
    const [showBanner, setShowBanner] = useState(true);

    const handleClose = useCallback(() => setShowBanner(false), []);

    if (!showBanner) {
        return null;
    }

    return (
        <div className="liquidity-banner-root">
            <div className="liquidity-banner-text-conteiner">
                <p className="liquidity-banner-text">The Bridge service is temporarily down for safety reasons.</p>
                {/* <p className="liquidity-banner-text small">
                    To buy and sell wMEMO, please click{" "}
                    <a target="_blank" href="https://app.uniswap.org/#/swap?outputCurrency=0x3b79a28264fc52c7b4cea90558aa0b162f7faf57">
                        here
                    </a>
                    .
                </p> */}
            </div>
            <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                <SvgIcon color="primary" component={xIcon} />
            </div>
        </div>
    );
}

export default LiquidityBanner;
