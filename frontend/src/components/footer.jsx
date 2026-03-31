import React from 'react';

const Footer = () => (
  <footer style={{
    width: '100%',
    padding: '40px 0',
    background: 'rgba(2, 6, 23, 0.5)',
    borderTop: '1px solid var(--border-glass)',
    marginTop: 'auto',
    textAlign: 'center'
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} TipAdder. Built by <span style={{ color: 'white', fontWeight: 'bold' }}>Sanjay K J</span>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
         <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>• Built for Web3</span>
         <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>• Powered by Ethereum</span>
         <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>• Real-time Fiat Sync</span>
      </div>
    </div>
  </footer>
);

export default Footer;