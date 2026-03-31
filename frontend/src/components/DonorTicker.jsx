import React, { useEffect, useState } from 'react';
import { useWallet } from '../WalletContext';

const DonorTicker = () => {
  const { contract } = useWallet();
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      if (!contract) return;
      try {
        const d = await contract.getDonors();
        if (d && d.length > 0) setDonors([...d]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDonors();
    // Refresh every 30s
    const interval = setInterval(fetchDonors, 30000);
    return () => clearInterval(interval);
  }, [contract]);

  if (!donors.length) return null;

  // Duplicate for seamless loop
  const doubled = [...donors, ...donors, ...donors];

  return (
    <div style={{
      background: 'rgba(99,179,237,0.05)',
      borderTop: '1px solid rgba(99,179,237,0.15)',
      borderBottom: '1px solid rgba(99,179,237,0.15)',
      padding: '10px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Label */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '140px',
        background: 'linear-gradient(90deg, var(--bg-primary) 70%, transparent)',
        zIndex: 2,
        display: 'flex', alignItems: 'center',
        paddingLeft: '20px',
        gap: '8px',
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#68d391', boxShadow: '0 0 8px #68d391', flexShrink: 0 }} />
        <span style={{
          fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
          color: '#68d391', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>Donors</span>
      </div>

      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: '80px',
        background: 'linear-gradient(270deg, var(--bg-primary) 60%, transparent)',
        zIndex: 2,
      }} />

      {/* Scrolling track */}
      <div style={{
        display: 'flex',
        gap: '32px',
        animation: 'ticker 25s linear infinite',
        whiteSpace: 'nowrap',
        paddingLeft: '160px',
      }}>
        {doubled.map((name, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: '500',
            fontFamily: 'Space Grotesk, sans-serif',
            color: 'rgba(255,255,255,0.7)',
          }}>
            <span style={{ color: '#63b3ed', fontSize: '11px' }}>♦</span>
            {name}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};

export default DonorTicker;