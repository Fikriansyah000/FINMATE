import { useAuthStore } from '../../store/authStore';

export const TopNav = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-end px-8">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">{user?.name}</span>
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
