import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Wallet } from 'lucide-react';

export const AuthLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 text-white flex-col justify-center p-16 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
             <div className="bg-white/20 p-2 rounded-xl">
               <Wallet size={32} className="text-white" />
             </div>
             <h1 className="font-bold text-2xl tracking-wide">FINMATE</h1>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">Manage Your<br/>Finances Smarter</h2>
          <p className="text-primary-100 text-lg max-w-md">Track expenses, monitor financial habits, and get insights to manage your money more effectively.</p>
        </div>
        
        {/* Decorative background elements mapping to mockup */}
        <div className="absolute bottom-10 left-10 right-10 h-64 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm p-6 flex flex-col justify-end">
             <div className="flex gap-4 items-end h-32 opacity-50">
                <div className="w-8 bg-green-400 rounded-t-sm h-16"></div>
                <div className="w-8 bg-green-400 rounded-t-sm h-24"></div>
                <div className="w-8 bg-green-400 rounded-t-sm h-12"></div>
                <div className="w-8 bg-green-400 rounded-t-sm h-32"></div>
                <div className="w-8 bg-green-400 rounded-t-sm h-20"></div>
             </div>
             <p className="mt-6 text-sm text-white/80">Your weekly spending analytics are monitored automatically.</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
