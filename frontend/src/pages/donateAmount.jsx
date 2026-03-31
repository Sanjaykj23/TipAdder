import React, { useState, useEffect } from "react";
import { useWallet } from "../WalletContext";
import { formatEther, parseEther } from "ethers";

const DonateAmount = () => {
    const { contract } = useWallet();
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrencies = async () => {
            if (contract) {
                const curr = await contract.getCurrencies();
                setCurrencies(curr);
            }
        };
        fetchCurrencies();
    }, [contract]);

    const handleDonate = async () => {
        if (!selectedCurrency || !amount) return;
        setLoading(true);
        try {
            const rateInWei = await contract.getCurrencyAmount(selectedCurrency);
            const totalETH = Number(amount) * Number(formatEther(rateInWei));
            const tx = await contract.donateAmount(name, { value: parseEther(totalETH.toFixed(18)) });
            await tx.wait();
            setName(""); setAmount("");
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="main-layout">
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '20px' }}>Send a Tip</h2>
                <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="custom-input" style={{ marginBottom: '15px' }} />
                <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="custom-input" style={{ marginBottom: '15px' }}>
                    <option value="">Select Currency</option>
                    {currencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="custom-input" style={{ marginBottom: '20px' }} />
                <button className="btn-primary" style={{ width: '100%' }} onClick={handleDonate} disabled={loading}>
                    {loading ? "Confirming..." : "Donate Now"}
                </button>
            </div>
        </div>
    );
};

export default DonateAmount;