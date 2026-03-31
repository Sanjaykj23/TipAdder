import React from 'react';
import { useWallet } from './WalletContext';

const ProtectedRoute = ({ children }) => {
    const { account, isMetaMaskInstalled, connectWallet } = useWallet();

    // 1. If MetaMask isn't installed at all
    if (!isMetaMaskInstalled) {
        return (
            <div className="main-layout">
                <div className="glass-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🦊</div>
                    <h2 style={{ color: 'var(--accent)', marginBottom: '10px' }}>Wallet Not Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.6' }}>
                        To interact with TipAdder, you need the **MetaMask** browser extension installed.
                    </p>
                    <a 
                        href="https://metamask.io/download/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-primary"
                        style={{ textDecoration: 'none', display: 'inline-block', width: '100%' }}
                    >
                        Install MetaMask
                    </a>
                </div>
            </div>
        );
    }

    // 2. If MetaMask is there, but the user hasn't clicked "Connect"
    if (!account) {
        return (
            <div className="main-layout">
                <div className="glass-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🔒</div>
                    <h2 style={{ marginBottom: '10px' }}>Authentication Required</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.6' }}>
                        Please connect your Ethereum wallet to access this secure section of the DApp.
                    </p>
                    <button 
                        className="btn-primary" 
                        style={{ width: '100%' }} 
                        onClick={connectWallet}
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    // 3. If everything is fine, render the requested page (children)
    return children;
};

export default ProtectedRoute;