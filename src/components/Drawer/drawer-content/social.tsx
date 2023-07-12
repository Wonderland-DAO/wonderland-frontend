import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import { ReactComponent as Reddit } from "../../../assets/icons/reddit.svg";
import { ReactComponent as Email } from "../../../assets/icons/email.svg";

export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://github.com/Wonderland-DAO" target="_blank">
                <SvgIcon color="primary" component={GitHub} />
            </Link>

            <Link href="https://twitter.com/wonderland_fi" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>

            <Link href="https://discord.gg/thDHseaHUt" target="_blank">
                <SvgIcon color="primary" component={Discord} />
            </Link>

            <Link href="https://www.reddit.com/r/WonderlandOfficial/" target="_blank">
                <SvgIcon color="primary" component={Reddit} />
            </Link>

            <Link href="mailto:info@wonderland.money" target="_blank">
                <SvgIcon color="primary" component={Email} />
            </Link>
        </div>
    );
}
