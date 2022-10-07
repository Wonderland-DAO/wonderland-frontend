import React, { useCallback, useState } from "react";
import "./liquidity-banner.scss";
import { ReactComponent as xIcon } from "../../assets/icons/x.svg";
import { SvgIcon } from "@material-ui/core";
import { redemptionPeriodStart, redemptionPeriodEnd } from "../../constants/redemption";
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
                <p className="liquidity-banner-text upper">Wonderland Moving Forward! 🚀</p>
                <p className="liquidity-banner-text small">“A wise person does at once, what a fool does at last.”</p>
            </div>
            <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                <SvgIcon color="primary" component={xIcon} />
            </div>
        </div>
    );

    if (redemptionPeriodStart < Date.now() && redemptionPeriodEnd < Date.now()) {
        return (
            <div className="liquidity-banner-root">
                <div className="liquidity-banner-text-conteiner">
                    <p className="liquidity-banner-text upper">The Wonderland Q3 2022 Redemption is now OVER!</p>
                    <p className="liquidity-banner-text">The next Quarterly Redemption is scheduled to begin on the 1st of January 2023.</p>
                </div>
                <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                    <SvgIcon color="primary" component={xIcon} />
                </div>
            </div>
        );
    }

    if (redemptionPeriodStart < Date.now()) {
        return (
            <div className="liquidity-banner-root">
                <div className="liquidity-banner-text-conteiner">
                    <p className="liquidity-banner-text upper">The Wonderland Q3 2022 Redemption is now LIVE!</p>
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
                    <p className="liquidity-banner-text upper">New Token Added to Farm!</p>
                    <p className="liquidity-banner-text small">$SPELL has been added to the rewards stream for holders!</p>
                </div>
                <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                    <SvgIcon color="primary" component={xIcon} />
                </div>
            </div>
        );
    }

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
                <p className="liquidity-banner-text">Rebases have ended as per WIP 17, please now wrap your</p>
                <p className="liquidity-banner-text">MEMO to wMEMO and take advantage of our farm.</p>
                <p className="liquidity-banner-text upper">
                    More info{" "}
                    <a target="_blank" href="https://www.wonderlandforum.xyz/t/wip-17-stopping-rebases/19100">
                        here
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LiquidityBanner;
