import React, { useState } from "react";
import { Networks } from "../../../../constants/blockchain";
import "./select-network.scss";
import ArrowDown from "../../../../assets/icons/arrow-down.svg";
import { getChainInfo } from "../../../../helpers/get-chains";
import SelectNetworksDialog from "./components/SelectNetworkDialog";

interface ISelectNetworkProps {
    network: Networks;
    from?: boolean;
    handleSelect: (network: Networks) => void;
}

function SelectNetwork({ network, from, handleSelect }: ISelectNetworkProps) {
    const { chainName, img } = getChainInfo(network);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const handleOnSelect = (network: Networks) => {
        handleSelect(network);
        handleCloseDialog();
    };

    return (
        <div className="select-network-dashboard">
            <p className="select-network-title">
                Switch to <b>Ethereum</b> or <b>Avalanche</b> to view your personal balance.
            </p>
            <div className="select-network-input" onClick={handleOpenDialog}>
                <p>
                    <img className="select-network-input-img" alt="" src={img} />
                    {chainName}
                </p>
                <img className="select-network-input-arrow" alt="" src={ArrowDown} />
            </div>
            <SelectNetworksDialog open={openDialog} handleClose={handleCloseDialog} handleSelect={handleOnSelect} />
        </div>
    );
}

export default SelectNetwork;
