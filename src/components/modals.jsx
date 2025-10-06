// goat-farm-app/src/components/modals.jsx

import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const ModalWrapper = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative text-gray-200 border border-gray-700">
            <h2 className="text-2xl font-bold text-green-400 mb-6">{title}</h2>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
            {children}
        </div>
    </div>
);

// Generic Form for reuse
const Form = ({ onSubmit, children, cta, loading }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <button type="submit" disabled={loading} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : cta}
        </button>
    </form>
);

export const AddPurchaseModal = ({ onClose, onSubmit, batches }) => {
    const [formData, setFormData] = useState({ batch: batches.length > 0 ? batches[0] : '', breed: '', age: '', purchaseWeight: '', purchaseCost: '' });
    const [status, setStatus] = useState({ loading: false, newGoatId: null });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, newGoatId: null });
        try {
            const newGoat = await onSubmit(formData);
            setStatus({ loading: false, newGoatId: newGoat.goatId });
        } catch (error) {
            console.error("Failed to add goat:", error);
            alert(error.response?.data?.message || 'Failed to add goat.');
            setStatus({ loading: false, newGoatId: null });
        }
    };

    if (status.newGoatId) {
        return (
            <ModalWrapper title="Success!" onClose={onClose}>
                <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-green-400 h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold">Goat Added Successfully</h3>
                    <p className="text-gray-300 mt-2">The new Goat ID is:</p>
                    <p className="text-2xl font-mono bg-gray-700 inline-block px-4 py-2 rounded-lg mt-2">{status.newGoatId}</p>
                </div>
                <button onClick={onClose} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Close</button>
            </ModalWrapper>
        )
    }

    return (
        <ModalWrapper title="Add Goat Purchase" onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Save Purchase" loading={status.loading}>
                <div>
                    <label className="block text-sm font-medium mb-1">Batch Name (Select or Type New)</label>
                    <input list="batch-options" name="batch" value={formData.batch} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                    <datalist id="batch-options">{batches.map(b => <option key={b} value={b} />)}</datalist>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Breed</label>
                    <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., Boer" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Age (m)</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 5" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                        <input type="number" step="0.1" name="purchaseWeight" value={formData.purchaseWeight} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 15.5" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cost (₹)</label>
                        <input type="number" name="purchaseCost" value={formData.purchaseCost} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 8500" required />
                    </div>
                </div>
            </Form>
        </ModalWrapper>
    );
};

export const EditGoatModal = ({ goat, batches, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ batch: goat.batch, breed: goat.breed, status: goat.status });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(goat._id, formData);
            onClose();
        } catch (error) {
            console.error("Failed to update goat:", error);
            alert(error.response?.data?.message || 'Failed to update goat.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title={`Edit Goat ${goat.goatId}`} onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Update Goat" loading={loading}>
                <div>
                    <label className="block text-sm font-medium mb-1">Batch Name</label>
                    <input list="batch-options" name="batch" value={formData.batch} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                    <datalist id="batch-options">{batches.map(b => <option key={b} value={b} />)}</datalist>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Breed</label>
                    <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required>
                        <option value="Active">Active</option>
                        <option value="Sold">Sold</option>
                        <option value="Died">Died</option>
                    </select>
                </div>
            </Form>
        </ModalWrapper>
    );
};

export const SellGoatModal = ({ goat, onClose, onSubmit }) => {
    const [salePrice, setSalePrice] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ goatId: goat.goatId, salePrice });
            onClose();
        } catch (error) {
            console.error("Failed to sell goat:", error);
            alert(error.response?.data?.message || 'Failed to sell goat.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title={`Sell Goat ${goat.goatId}`} onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Confirm Sale" loading={loading}>
                <div>
                    <label className="block text-sm font-medium mb-1">Sale Price (₹)</label>
                    <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 22500" required />
                </div>
            </Form>
        </ModalWrapper>
    );
};

export const RecordWeightModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ goatId: '', weight: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Failed to record weight:", error);
            alert(error.response?.data?.message || 'Failed to record weight. Check Goat ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title="Record Goat Weight" onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Record Weight" loading={loading}>
                <div>
                    <label className="block text-sm font-medium mb-1">Goat ID</label>
                    <input type="text" name="goatId" value={formData.goatId} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., G-001" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">New Weight (kg)</label>
                    <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 28.5" required />
                </div>
            </Form>
        </ModalWrapper>
    );
};


export const AddExpenseModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ category: 'Medical', amount: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Failed to add expense:", error);
            alert(error.response?.data?.message || 'Failed to add expense.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title="Add New Expense" onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Add Expense" loading={loading}>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required>
                        <option value="Medical">Medical</option>
                        <option value="Labor">Labor</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Repairs">Repairs</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 3500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., Deworming medication" required />
                </div>
            </Form>
        </ModalWrapper>
    );
};

export const AddFeedStockModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ name: '', quantity: '', cost: '', unit: 'kg' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Failed to add feed stock:", error);
            alert(error.response?.data?.message || 'Failed to add stock.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title="Add Feed Stock" onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Add Stock" loading={loading}>
                <div>
                    <label className="block text-sm font-medium mb-1">Feed Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., TMR Mix" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <select name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required>
                            <option value="kg">kg</option>
                            <option value="bags">bags</option>
                            <option value="units">units</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Total Cost (₹)</label>
                    <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 25000" required />
                </div>
            </Form>
        </ModalWrapper>
    );
};

export const LogFeedModal = ({ onClose, onSubmit, batches, feedNames }) => {
    const [formData, setFormData] = useState({ target: 'all', feedName: feedNames.length > 0 ? feedNames[0] : '', quantity: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Failed to log feed:", error);
            alert(error.response?.data?.message || 'Failed to log feed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title="Log a Feeding" onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Log Feed" loading={loading}>
                <div>
                    <label className="block text-sm font-medium mb-1">Target</label>
                    <select name="target" value={formData.target} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required>
                        <option value="all">All Active Goats</option>
                        {batches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Feed Type</label>
                        <select name="feedName" value={formData.feedName} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required disabled={feedNames.length === 0}>
                            {feedNames.length > 0 ? feedNames.map(name => <option key={name} value={name}>{name}</option>) : <option>No feed in inventory</option>}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                        <input type="number" step="0.1" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., 50.5" required />
                    </div>
                </div>
            </Form>
        </ModalWrapper>
    );
};

export const AddMedicalRecordModal = ({ goat, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ eventType: 'Treatment', medication: '', dosage: '', notes: '', reminderDate: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(goat._id, formData);
            onClose();
        } catch (error) {
            console.error("Failed to add medical record:", error);
            alert(error.response?.data?.message || 'Failed to add record.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title={`Add Medical Record for ${goat.goatId}`} onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Save Record" loading={loading}>
                {/* Form fields for eventType, medication, dosage, etc. */}
            </Form>
        </ModalWrapper>
    );
};

export const AddBreedingRecordModal = ({ goat, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ sireId: '', breedingDate: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(goat._id, formData);
            onClose();
        } catch (error) {
            console.error("Failed to add breeding record:", error);
            alert(error.response?.data?.message || 'Failed to add record.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title={`Add Breeding Record for ${goat.goatId}`} onClose={onClose}>
            <Form onSubmit={handleSubmit} cta="Save Record" loading={loading}>
                {/* Form fields for sireId and breedingDate */}
            </Form>
        </ModalWrapper>
    );
};