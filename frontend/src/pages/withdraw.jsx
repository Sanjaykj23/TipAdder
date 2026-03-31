import React from "react";
import { useWallet } from "../WalletContext";
import { ethers } from "ethers";

const Withdraw = () => {
    const { contract, totalDonated } = useWallet();

    const handleWithdraw = async () => {
        try {
            const tx = await contract.withdrawAmount();
            await tx.wait();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="main-layout">
            <div className="glass-card" style={{ textAlign: 'center', minWidth: '350px' }}>
                <h2>Vault Management</h2>
                <div style={{ margin: '30px 0' }}>
                    <h1 style={{ color: 'var(--accent)', fontSize: '3rem', margin: 0 }}>
                        {totalDonated ? ethers.formatEther(totalDonated) : "0.0"}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>ETH IN VAULT</p>
                </div>
                {Number(totalDonated) > 0 ? (
                    <button className="btn-primary" style={{ width: '100%' }} onClick={handleWithdraw}>Withdraw Funds</button>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>Vault is empty</p>
                )}
            </div>
        </div>
    );
};

export default Withdraw;