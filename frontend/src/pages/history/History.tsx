import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, Edit2, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Expense } from '../../types';

export const History = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit State
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/expenses');
      setExpenses(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch expenses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const getCategoryBadgeVariant = (name: string) => {
    const lower = name.toLowerCase();
    if (['makanan', 'food'].includes(lower)) return 'success';
    if (['transportasi', 'transport'].includes(lower)) return 'info';
    if (['tagihan', 'bills'].includes(lower)) return 'warning';
    return 'default';
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDesc(expense.description);
    setEditAmount(expense.amount.toString());
    setEditDate(expense.transactionDate.split('T')[0]);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    try {
      setIsSaving(true);
      await api.patch(`/expenses/${editingExpense.id}`, {
        description: editDesc,
        amount: parseInt(editAmount, 10),
        transactionDate: editDate,
      });
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      alert('Failed to update expense');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        setDeletingId(id);
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        alert('Failed to delete expense');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Expense History</h1>
        <p className="text-slate-600">Track and manage your recent financial activities.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100">
           <AlertCircle size={20} />
           {error}
           <Button variant="outline" className="ml-auto bg-white" onClick={fetchExpenses}>Retry</Button>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-white">
          <div className="w-full max-w-sm">
            <Input 
              placeholder="Search transactions..." 
              icon={<Search size={18} />} 
              className="bg-slate-50"
            />
          </div>
          <div className="flex gap-2">
            <select className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Categories</option>
              <option>Makanan</option>
              <option>Transportasi</option>
            </select>
            <Button variant="outline" className="px-3">
              <Filter size={18} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading expenses...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                    <p className="mb-2">No expenses found.</p>
                    <p className="text-xs text-slate-400">Your logged expenses will appear here.</p>
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getCategoryBadgeVariant(expense.category.name)}>
                        {expense.category.name}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{expense.description}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEdit(expense)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          disabled={deletingId === expense.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm text-slate-600">
          <div>Showing 1 to {expenses.length} of {expenses.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" className="px-3 py-1 text-xs">Previous</Button>
            <Button variant="primary" className="px-3 py-1 text-xs bg-primary-600">1</Button>
            <Button variant="outline" className="px-3 py-1 text-xs">Next</Button>
          </div>
        </div>
      </Card>

      {/* Edit Modal Overlay */}
      {editingExpense && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6">Edit Expense</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="DESCRIPTION"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
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
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Input
                label="DATE"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setEditingExpense(null)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
