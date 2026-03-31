import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../WalletContext';

const Navbar = () => {
    const { account, connectWallet, timeLeft } = useWallet();
    const location = useLocation();

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <nav style={{
            position: 'fixed', top: 0, width: '100%', zCenter: 1000,
            background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-glass)', padding: '15px 0'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                <Link to="/" style={{ fontSize: '1.6rem', fontWeight: '800', textDecoration: 'none', color: 'white' }}>
                    TipAdder<span style={{ color: 'var(--accent)' }}>.eth</span>
                </Link>

                <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/donateamount" className={`nav-item ${location.pathname === '/donateamount' ? 'active' : ''}`}>Donate</Link>
                    <Link to="/withdrawamount" className={`nav-item ${location.pathname === '/withdrawamount' ? 'active' : ''}`}>Withdraw</Link>
                    
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--accent)', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        ⏱ {formatTime(timeLeft)}
                    </div>

                    {account ? (
                        <div style={{ background: 'var(--accent)', color: 'black', padding: '8px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem' }}>
                            {account.slice(0,6)}...{account.slice(-4)}
                        </div>
                    ) : (
                        <button className="btn-primary" onClick={connectWallet}>Connect</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;