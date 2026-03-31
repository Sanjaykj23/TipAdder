import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { ethers, parseEther } from 'ethers';
import abiData from './utils/TipDonate.json';
import { notifyError, notifyInfo, notifySuccess } from './components/notification';

const WalletContext = createContext();
const cAddress = "0xc94BB9D25855042fa91Ca4D5489208D8B6B22c85";

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalDonated, setTotalDonates] = useState(0);
    const [getOwner, setOwner] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const isRecalculating = useRef(false);
    const intervalRef = useRef(null);

    const connectWallet = async () => {
        if (!window.ethereum) return console.error("Install MetaMask");
        try {
            setIsMetaMaskInstalled(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            const deploy = new ethers.Contract(cAddress, abiData.abi, signer);
            
            setAccount(address);
            setContract(deploy);
            
            const ownerAddress = await deploy.getOwner();
            setOwner(ownerAddress);
        } catch (error) { console.error("Connection Error:", error); }
    };

    const convertFiatToEth = async (fiat) => {
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${fiat.toLowerCase()}`);
            const data = await res.json();
            return 1 / data.ethereum[fiat.toLowerCase()];
        } catch (e) { console.error(e); }
    };

    const recalculateAllAmounts = async () => {
        if (!contract || !account || isRecalculating.current) return;
        try {
            isRecalculating.current = true;
            const rawSymbols = await contract.getCurrencies();
            const symbols = Array.from(rawSymbols).map(s => String(s));
            if (symbols.length === 0) return (isRecalculating.current = false);

            const pricesInWei = [];
            for (const sym of symbols) {
                const rate = await convertFiatToEth(sym);
                if (rate) pricesInWei.push(parseEther(Number(rate).toFixed(18)));
            }

            if (pricesInWei.length === symbols.length) {
                const tx = await contract.updateAllPrices(symbols, pricesInWei);
                await tx.wait();
            }
        } catch (err) { console.error("Sync Error:", err); }
        finally { isRecalculating.current = false; }
    };

    useEffect(() => {
        let isMounted = true;
        const syncTimer = async () => {
            if (!contract || !account) return;
            try {
                if (intervalRef.current) clearInterval(intervalRef.current);
                const nextUpdate = await contract.nextUpdateTime();
                const diff = Number(nextUpdate) - Math.floor(Date.now() / 1000);
                if (!isMounted) return;

                if (diff > 0) {
                    setTimeLeft(diff);
                    intervalRef.current = setInterval(() => {
                        setTimeLeft((prev) => {
                            if (prev <= 1) {
                                clearInterval(intervalRef.current);
                                recalculateAllAmounts();
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                } else {
                    setTimeLeft(0);
                    recalculateAllAmounts();
                }
            } catch (e) { console.error(e); }
        };
        syncTimer();
        return () => { isMounted = false; clearInterval(intervalRef.current); };
    }, [account, refreshTrigger, contract]);

    useEffect(() => {
        if (!contract) return;
        const initialUpdate = async () => setTotalDonates(await contract.totalDonations());
        
        contract.on("updatePrices", () => setRefreshTrigger(p => p + 1));
        contract.on("donatedAmount", async (name, amt) => {
            notifySuccess(`New Donation: ${name} sent ${ethers.formatEther(amt)} ETH`);
            setTotalDonates(await contract.totalDonations());
        });
        
        initialUpdate();
        return () => contract.removeAllListeners();
    }, [contract]);

    return (
        <WalletContext.Provider value={{ isMetaMaskInstalled, account, contract, connectWallet, convertFiatToEth, timeLeft, totalDonated, getOwner }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);