import React, { useEffect, useState } from "react";
import { useWallet } from "../WalletContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { contract } = useWallet();
    const [donors, setDonors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonors = async () => {
            if (contract) {
                try {
                    const list = await contract.getDonors();
                    setDonors(list);
                } catch (err) { console.error(err); }
            }
        };
        fetchDonors();
    }, [contract]);

    return (
        <div className="main-layout">
            <div className="glass-card" style={{ textAlign: 'center', width: '90%', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>
                    TipAdder<span style={{ color: 'var(--accent)' }}>.eth</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '30px' }}>
                    The world's first automated fiat-to-crypto donation gateway.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => navigate("/donateamount")}>Donate Now</button>
                    <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }} onClick={() => navigate("/addcurrency")}>Add Currency</button>
                </div>
            </div>

            <div className="donor-marquee-wrapper" style={{ marginTop: '50px' }}>
                <div className="marquee-content">
                    {donors.length > 0 ? (
                        [...donors, ...donors].map((name, i) => (
                            <span key={i} className="donor-name-item">💠 {name.toUpperCase()}</span>
                        ))
                    ) : (
                        <span className="donor-name-item">WAITING FOR THE FIRST GENEROUS DONOR...</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;