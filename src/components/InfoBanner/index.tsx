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

    if (redemptionPeriodStart < Date.now() && redemptionPeriodEnd > Date.now()) {
        return (
            <div className="liquidity-banner-root">
                <div className="liquidity-banner-text-conteiner">
                    <p className="liquidity-banner-text upper">❄️ The Wonderland Q4 2022 Redemption is now LIVE! ❄️</p>
                </div>
                <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                    <SvgIcon color="primary" component={xIcon} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="liquidity-banner-root">
                <div className="liquidity-banner-text-conteiner">
                    <p className="liquidity-banner-text">Make Wonderland 🍇 again.</p>
                </div>
                <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                    <SvgIcon color="primary" component={xIcon} />
                </div>
            </div>
        );

        return (
            <div className="liquidity-banner-root">
                <div className="liquidity-banner-text-conteiner">
                    <p className="liquidity-banner-text upper">A new wild token appeared!</p>
                    <p className="liquidity-banner-text small">Stable coin USDC.e is available for farming!</p>
                    <div className="liquidity-banner-left-gif">
                        <img alt="" src={RainGif} />
                    </div>
                    <div className="liquidity-banner-right-gif">
                        <img alt="" src={RainGif} />
                    </div>
                </div>
                <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                    <SvgIcon color="primary" component={xIcon} />
                </div>
            </div>
        );
    }
}

export default LiquidityBanner;
