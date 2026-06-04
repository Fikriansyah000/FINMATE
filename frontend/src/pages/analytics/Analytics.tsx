import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { TrendingUp, PiggyBank, Utensils, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const Analytics = () => {
  const [summary, setSummary] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [sumRes, catRes, monthRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/categories'),
          api.get('/analytics/monthly')
        ]);
        setSummary(sumRes.data);
        setCategories(catRes.data);
        
        // Format dates for Recharts (e.g. 'Oct 1')
        const formattedMonthly = monthRes.data.map((item: any) => ({
          ...item,
          formattedDate: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(item.date))
        }));
        setMonthlyData(formattedMonthly);
      } catch (err: any) {
        setError('Failed to load analytics data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 flex flex-col items-center gap-2">
        <AlertCircle size={32} />
        <p>{error}</p>
      </div>
    );
  }

  const totalSpending = summary?.totalSpending || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-600">Gain deeper insights into your financial behavior.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col gap-6">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h3 className="font-bold text-slate-900">Key Insight</h3>
                </div>
                <TrendingUp className="text-green-500 opacity-50" size={24} />
              </div>
              {summary?.topCategory ? (
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  You spent <span className="font-bold text-slate-900">{formatCurrency(summary.topCategory.amount)}</span> on {summary.topCategory.name} this period.
                </p>
              ) : (
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">Not enough data for insights yet.</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium pt-4 border-t border-slate-100">
               <span className="text-slate-500 font-normal">Average Daily: {formatCurrency(summary?.averageDailySpending || 0)}</span>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">Total Spending</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-primary-600">{formatCurrency(totalSpending)}</h2>
              <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                <PiggyBank size={24} />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">{summary?.totalTransactions || 0} Transactions</p>
          </Card>
        </div>

        <Card className="lg:col-span-2 p-6 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Expense Trend</h3>
              <p className="text-sm text-slate-500">Your spending over time.</p>
            </div>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[250px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#403ae2" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#403ae2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `Rp${(val / 1000)}K`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#403ae2" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No trend data available</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6 flex flex-col h-full">
          <p className="text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">Top Category</p>
          {summary?.topCategory && totalSpending > 0 ? (
            <div className="flex flex-col flex-1 justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary-100 p-4 rounded-xl text-primary-600">
                  <Utensils size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900">{summary.topCategory.name}</h4>
                  <p className="text-sm text-slate-500">{formatCurrency(summary.topCategory.amount)}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-700">Percentage of Total</span>
                  <span className="text-sm font-bold text-primary-600">{Math.round((summary.topCategory.amount / totalSpending) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${Math.round((summary.topCategory.amount / totalSpending) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-sm text-slate-400">
              No top category data
            </div>
          )}
        </Card>

        <Card className="md:col-span-2 p-6 flex flex-col h-full">
          <p className="text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">All Categories Distribution</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 flex-1">
            {categories.map((cat, idx) => {
              const percentage = totalSpending > 0 ? Math.round((cat.amount / totalSpending) * 100) : 0;
              return (
                <div key={idx} className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-700">{cat.category}</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 flex-1">
                      <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 w-8 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && (
              <div className="text-sm text-slate-400 col-span-1 sm:col-span-2 text-center py-4 flex-1 flex items-center justify-center">No categories found</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
