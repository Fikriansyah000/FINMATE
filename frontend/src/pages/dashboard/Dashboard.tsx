import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { Receipt } from 'lucide-react';
import api from '../../services/api';

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/expenses', {
        description,
        amount: parseInt(amount, 10),
        transactionDate,
      });

      const predictedCategory = response.data.category.name;
      setSuccessMessage(`Expense saved! Categorized as: ${predictedCategory}`);
      setDescription('');
      setAmount('');
      
      // clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-600">Your spending is well under control today. You've saved <span className="text-green-600 font-semibold">15%</span> compared to last week.</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Add New Expense</h2>
            <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
              <Receipt size={24} />
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="DESCRIPTION"
              placeholder="e.g., Lunch at the office"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AMOUNT</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">Rp</span>
                </div>
                <input
                  type="number"
                  min="0"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <Input
              label="DATE"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />

            <div className="pt-4">
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Expense ⊕'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
