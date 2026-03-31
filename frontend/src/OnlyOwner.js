import React from "react";
import { useWallet } from "./WalletContext";
import { useNavigate } from "react-router-dom";

const OnlyOwner = ({ children }) => {
  const { account, getOwner } = useWallet();
  const navigate = useNavigate();

  if (!getOwner) {
    return (
      <div className="main-layout">
        <div className="glass-card"><h3 className="sync-msg">Verifying Authority...</h3></div>
      </div>
    );
  }

  if (!account || account.toLowerCase() !== getOwner.toLowerCase()) {
    return (
      <div className="main-layout">
        <div className="glass-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem' }}>🚫</h1>
          <h2 style={{ color: '#ff4d4d' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            This section is restricted to the Contract Owner.
          </p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default OnlyOwner;