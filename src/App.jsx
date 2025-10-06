// goat-farm-app/src/App.jsx

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, HeartPulse, DollarSign, Wheat, LineChart } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GoatTracking from './pages/GoatTracking.jsx';
import GoatDetailPage from './pages/GoatDetailPage.jsx'; // Import the new page
import FeedManagement from './pages/FeedManagement.jsx';
import FinancialHub from './pages/FinancialHub.jsx';
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import {
  AddPurchaseModal, LogFeedModal, RecordWeightModal,
  AddExpenseModal, SellGoatModal, AddFeedStockModal, EditGoatModal,
  AddMedicalRecordModal, AddBreedingRecordModal // Import new modals
} from './components/modals.jsx';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const App = () => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')) || null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [selectedGoat, setSelectedGoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [goats, setGoats] = useState([]);
  const [batches, setBatches] = useState({});
  const [feedInventory, setFeedInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [feedLog, setFeedLog] = useState([]);

  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${auth?.token}`
      }
    });
  }, [auth]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (auth) {
        setLoading(true);
        setError(null);
        try {
          const res = await apiClient.get('/data/all');
          setGoats(res.data.goats || []);
          setBatches(res.data.batches || {});
          setFeedInventory(res.data.feedInventory || []);
          setExpenses(res.data.expenses || []);
          setIncome(res.data.income || []);
          setFeedLog(res.data.feedLog || []);
        } catch (err) {
          console.error("Failed to fetch data:", err);
          setError("Could not load farm data. Please try logging in again.");
          if (err.response && err.response.status === 401) {
            handleLogout();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [auth, apiClient]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'goatTracking', label: 'Goat Tracking', icon: HeartPulse },
    { id: 'feedManagement', label: 'Feed & Inventory', icon: Wheat },
    { id: 'financialHub', label: 'Financial Hub', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
  ];

  const handleAddPurchase = async (purchaseData) => {
    const res = await apiClient.post('/data/goats', purchaseData);
    const { newGoat, newExpense, newBatch } = res.data;
    setGoats(prev => [newGoat, ...prev]);
    setExpenses(prev => [newExpense, ...prev]);
    if (newBatch) {
      setBatches(prev => ({ ...prev, [newBatch.name]: { startDate: newBatch.startDate, _id: newBatch._id } }));
    }
    return newGoat;
  };

  const handleUpdateGoat = async (goatId, updateData) => {
    const res = await apiClient.put(`/data/goats/${goatId}`, updateData);
    const updatedGoat = res.data;
    setGoats(prev => prev.map(g => (g._id === updatedGoat._id ? updatedGoat : g)));
  };

  const handleLogFeed = async (feedData) => {
    const res = await apiClient.post('/data/feed-log', feedData);
    const { newFeedLog, updatedFeedItem } = res.data;
    setFeedLog(prev => [newFeedLog, ...prev]);
    if (updatedFeedItem) {
      setFeedInventory(prev => prev.map(item => item._id === updatedFeedItem._id ? updatedFeedItem : item));
    }
  };

  const handleRecordWeight = async (weightData) => {
    const goat = goats.find(g => g.goatId.toLowerCase() === weightData.goatId.toLowerCase());
    if (!goat) throw new Error("Goat ID not found");
    const res = await apiClient.post(`/data/goats/${goat._id}/weight`, { weight: weightData.weight });
    const updatedGoat = res.data;
    setGoats(prev => prev.map(g => (g._id === updatedGoat._id ? updatedGoat : g)));
  };

  const handleAddExpense = async (expenseData) => {
    const res = await apiClient.post('/data/expenses', expenseData);
    setExpenses(prev => [res.data, ...prev]);
  };

  const handleSellGoat = async (saleData) => {
    const goat = goats.find(g => g.goatId === saleData.goatId);
    if (!goat) throw new Error("Goat ID not found");
    const res = await apiClient.post(`/data/goats/${goat._id}/sell`, { salePrice: saleData.salePrice });
    const { updatedGoat, newIncome } = res.data;
    setGoats(prev => prev.map(g => (g._id === updatedGoat._id ? updatedGoat : g)));
    setIncome(prev => [newIncome, ...prev]);
  };

  const handleAddFeedStock = async (feedStockData) => {
    const res = await apiClient.post('/data/feed-stock', feedStockData);
    const { updatedFeedItem, newExpense } = res.data;
    setExpenses(prev => [newExpense, ...prev]);
    const existingItem = feedInventory.find(item => item._id === updatedFeedItem._id);
    if (existingItem) {
      setFeedInventory(prev => prev.map(item => item._id === updatedFeedItem._id ? updatedFeedItem : item));
    } else {
      setFeedInventory(prev => [updatedFeedItem, ...prev]);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      if (res.data.token) {
        const authData = { user: res.data.result, token: res.data.token };
        localStorage.setItem('auth', JSON.stringify(authData));
        setAuth(authData);
        setCurrentPage('dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please check credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    setGoats([]); setBatches({}); setFeedInventory([]); setExpenses([]); setIncome([]); setFeedLog([]);
  };

  const handleAddMedicalRecord = async (goatId, recordData) => {
    const res = await apiClient.post(`/data/goats/${goatId}/medical`, recordData);
    const updatedGoat = res.data;
    setGoats(prev => prev.map(g => (g._id === updatedGoat._id ? updatedGoat : g)));
    setSelectedGoat(updatedGoat); // Update the selected goat state
  };

  const handleAddBreedingRecord = async (goatId, recordData) => {
    const res = await apiClient.post(`/data/goats/${goatId}/breeding`, recordData);
    const updatedGoat = res.data;
    setGoats(prev => prev.map(g => (g._id === updatedGoat._id ? updatedGoat : g)));
    setSelectedGoat(updatedGoat); // Update the selected goat state
  };


  const renderPage = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-full"><p className="text-xl">Loading Farm Data...</p></div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-full"><p className="text-xl text-red-400">{error}</p></div>;
    }
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard goats={goats} batches={batches} expenses={expenses} income={income} setModal={setModal} />;
      case 'goatTracking':
        return <GoatTracking goats={goats} setModal={setModal} />;
      case 'goatDetail':
        return <GoatDetailPage goat={selectedGoat} setCurrentPage={setCurrentPage} setModal={setModal} />;
      case 'feedManagement':
        return <FeedManagement feedInventory={feedInventory} feedLog={feedLog} setModal={setModal} />;
      case 'financialHub':
        return <FinancialHub expenses={expenses} income={income} goats={goats} />;
      case 'analytics':
        return <AnalyticsDashboard goats={goats} batches={batches} feedLog={feedLog} />;
      default:
        return <Dashboard goats={goats} batches={batches} expenses={expenses} income={income} setModal={setModal} />;
    }
  };

  const renderModal = () => {
    if (!modal.type) return null;
    const sortedBatches = Object.keys(batches).sort((a, b) => new Date(batches[b].startDate) - new Date(batches[a].startDate));

    switch (modal.type) {
      case 'addPurchase':
        return <AddPurchaseModal onClose={() => setModal({ type: null })} onSubmit={handleAddPurchase} batches={sortedBatches} />;
      case 'editGoat':
        return <EditGoatModal goat={modal.data} batches={sortedBatches} onClose={() => setModal({ type: null })} onSubmit={handleUpdateGoat} />;
      case 'logFeed': return <LogFeedModal onClose={() => setModal({ type: null })} onSubmit={handleLogFeed} batches={sortedBatches} feedNames={feedInventory.map(f => f.name)} />;
      case 'recordWeight': return <RecordWeightModal onClose={() => setModal({ type: null })} onSubmit={handleRecordWeight} />;
      case 'addExpense': return <AddExpenseModal onClose={() => setModal({ type: null })} onSubmit={handleAddExpense} />;
      case 'sellGoat': return <SellGoatModal goat={modal.data} onClose={() => setModal({ type: null })} onSubmit={handleSellGoat} />;
      case 'addFeedStock': return <AddFeedStockModal onClose={() => setModal({ type: null })} onSubmit={handleAddFeedStock} />;
      case 'addMedicalRecord':
        return <AddMedicalRecordModal goat={modal.data} onClose={() => setModal({ type: null })} onSubmit={handleAddMedicalRecord} />;
      case 'addBreedingRecord':
        return <AddBreedingRecordModal goat={modal.data} onClose={() => setModal({ type: null })} onSubmit={handleAddBreedingRecord} />;
      default:
        return null;
    }
  };

  if (!auth) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar
        navItems={navItems}
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          setSidebarOpen(false); // Close sidebar on navigation
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          currentPageLabel={navItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
        />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      {renderModal()}
    </div>
  );
};

export default App;