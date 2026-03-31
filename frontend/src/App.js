import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './WalletContext';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import Withdraw from './pages/withdraw';
import ProtectedRoute from './ProtectRouter';
import AddCurrency from './pages/addCurrency';
import DonateAmount from './pages/donateAmount';
import Notification from './components/notification';
import OnlyOwner from './OnlyOwner';

function App() {
    return (
        <div className="App">
            {/* WalletProvider wraps everything so all components can access the contract */}
            <WalletProvider>
                <Router>
                    {/* Fixed Navbar stays at the top */}
                    <Navbar />
                    
                    {/* The Routes are rendered inside the main document flow. 
                       The 'main-layout' class in your pages will handle the 100px 
                       padding-top to avoid hiding under the Navbar.
                    */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        
                        <Route path="/addcurrency" element={
                            <ProtectedRoute>
                                <OnlyOwner>
                                    <AddCurrency />
                                </OnlyOwner>
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/donateamount" element={
                            <ProtectedRoute>
                                <DonateAmount />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/withdrawamount" element={
                            <ProtectedRoute>
                                <OnlyOwner>
                                    <Withdraw />
                                </OnlyOwner>
                            </ProtectedRoute>
                        } />
                    </Routes>

                    {/* Global Notifications listener */}
                    <Notification />
                    
                    {/* Footer stays at the bottom of the page */}
                    <Footer />
                </Router>
            </WalletProvider>
        </div>
    );
}

export default App;