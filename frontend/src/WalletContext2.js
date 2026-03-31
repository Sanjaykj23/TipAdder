import { createContext, useState, useContext, useEffect, use } from 'react';
import { ethers } from 'ethers';
import abiData from './utils/TipDonate.json';
import { parseEther } from 'ethers';

const WalletContext = createContext();
const cAddress = "0x5Fe6ab501Fcf0aAF04123cd03C5E4cFE0E8f56b2";

export const WalletProvider = ({ children }) => {
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const connectWallet = async () => {
        if (window.ethereum) {
            console.log("MetaMask is installed!");
            setIsMetaMaskInstalled(true);
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const signer = await provider.getSigner();
                setSigner(signer);

                const address = await signer.getAddress();
                setAccount(address);

                const contractAddress = cAddress;
                const deploy = new ethers.Contract(contractAddress, abiData.abi, signer);
                setContract(deploy);
                //syncTimernow();
            } catch (error) {
                console.error("Error connecting to MetaMask: ", error);
            }
        } else {
            console.error("MetaMask is not installed. Please install MetaMask to use this DApp.");
        }
    };

    const recalculateAllAmounts = async () => {
        if (!contract) return;
        try {
            // 1. Convert the frozen Result into a fresh JS Array
            const symbols = [...(await contract.Currencies())];
            const pricesInWei = [];

            for (const currency of symbols) {
                const OneCurrencyInETH = await convertFiatToEth(currency);

                // Ensure we have a valid price before proceeding
                if (OneCurrencyInETH) {
                    const truncketedETH = Number(OneCurrencyInETH).toFixed(18);
                    console.log(`Currency: ${currency} amount: ${truncketedETH}`);
                    pricesInWei.push(parseEther(truncketedETH));
                }
            }

            if (pricesInWei.length === symbols.length) {
                console.log("Sending Batch Update to Blockchain...");
                const tx = await contract.updateAllPrices(symbols, pricesInWei);
                await tx.wait();
                console.log("Batch Update Successful!");
            }

        } catch (err) {
            console.error("Recalculation error:", err);
        }
    }

    const [nextUpdateTime, setNextUpdateTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let interval;
        const syncTimer = async () => {
            if (!contract || !account) return;
            try {
                // Get the target timestamp from Blockchain (e.g., 1715812000)
                const nextUpdateOnChain = await contract.getNextUpdateTime();
                const targetTime = Number(nextUpdateOnChain);

                // 1. Initial calculation
                const now = Math.floor(Date.now() / 1000);
                const initialDiff = targetTime - now;

                if (initialDiff > 0) {
                    setTimeLeft(initialDiff);
                } else {
                    // If the time already passed before we loaded
                    setTimeLeft(0);
                    recalculateAllAmounts();
                    return;
                }

                // 2. Start the 1-second heartbeat
                interval = setInterval(() => {
                    setTimeLeft((prevTime) => {
                        if (prevTime <= 1) {
                            // Time is up!
                            clearInterval(interval);
                            recalculateAllAmounts();
                            console.log("recal");
                            return 0;
                        }
                        return prevTime - 1; // This creates the 19, 18, 17 effect
                    });
                }, 1000);

            } catch (err) {
                console.error("Blockchain Timer Error:", err);
            }
        };

        syncTimer();

        // Cleanup: Stop the timer if the user leaves the page or disconnects
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [account, contract, refreshTrigger]); // Re-runs if account or contract changes

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            setIsMetaMaskInstalled(true);
        }
    }, []);

    const convertFiatToEth = async (fiatSymbol) => {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${fiatSymbol.toLowerCase()}`
            );
            const data = await response.json();
            const ethPriceInFiat = data.ethereum[fiatSymbol.toLowerCase()];
            const oneFiatInEth = 1 / ethPriceInFiat;
            console.log(`Current Rate: 1 ${fiatSymbol.toUpperCase()} = ${oneFiatInEth.toFixed(10)} ETH`);
            return oneFiatInEth;
        } catch (error) {
            console.error("Conversion error:", error);
        }
    };
    useEffect(() => {
        if (!contract) return;

        // Assuming your Solidity event is called 'updatePrices'
        const handleEvent = async () => {
            console.log("Event received: Batch updated! Restarting timer...");
            setRefreshTrigger(prev => prev + 1); // This "kicks" the other effect
        };
        contract.on("updatePrices", handleEvent);

        return () => {
            contract.off("updatePrices", handleEvent); // Cleanup listener
        };
    }, [contract]);

    return (
        <WalletContext.Provider
            value={{ isMetaMaskInstalled, account, contract, balance, connectWallet, convertFiatToEth, nextUpdateTime, timeLeft }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
