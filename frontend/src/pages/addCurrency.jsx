import React, { useState } from "react";
import { useWallet } from "../WalletContext";
import { parseEther } from "ethers";

const AddCurrency = () => {
    const { contract, convertFiatToEth } = useWallet();
    const [currency, setCurrency] = useState("");
    const [loading, setLoading] = useState(false);

    async function addCurrency() {
        if (!currency) return;
        setLoading(true);
        try {
            const tx = await contract.addNewCurrency(currency);
            await tx.wait();
            const rate = await convertFiatToEth(currency);
            const tx2 = await contract.setETHforCurrency(currency, parseEther(rate.toFixed(18)));
            await tx2.wait();
            setCurrency("");
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    }

    return (
        <div className="main-layout">
            <div className="glass-card" style={{ maxWidth: '400px' }}>
                <h2>Add Currency</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>Register fiat (usd, inr) to enable automated conversion.</p>
                <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value.toLowerCase())} placeholder="Enter currency name" className="custom-input" style={{ marginBottom: '15px' }} />
                <button onClick={addCurrency} className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? "Updating Chain..." : "Add to Registry"}
                </button>
            </div>
        </div>
    );
};

export default AddCurrency;