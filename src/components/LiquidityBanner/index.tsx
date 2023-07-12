import React, { useCallback, useState } from "react";
import "./liquidity-banner.scss";
import { ReactComponent as xIcon } from "../../assets/icons/x.svg";
import { SvgIcon } from "@material-ui/core";
import CircleIcon from "../../assets/icons/circle.svg";

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
                {/* <p className="liquidity-banner-text small">Our elastic Liquidity Pool on KyberSwap has been relaunched.</p> */}
            </div>
            <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                <SvgIcon color="primary" component={xIcon} />
            </div>
        </div>
    );
}

export default LiquidityBanner;
