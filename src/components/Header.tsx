import React from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const user = useUserStore(state => state.currentUser);
  const navigate = useNavigate();

  const handleStrategyClick = () => {
    // Placeholder: navigate to advisory strategy page or open modal
    console.log('Advisory Strategy clicked');
    // Example navigation – adjust route as needed
    navigate('/strategy');
  };

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-[#0E5A44] to-[#D4AF37] p-4 shadow-md">
      <div className="text-white font-medium text-lg">
        {user ? `Welcome, ${user.firstName ?? user.name ?? 'User'}` : 'Welcome'}
      </div>
      <button
        onClick={handleStrategyClick}
        className="bg-white text-[#0E5A44] font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
      >
        Advisory Strategy
      </button>
    </header>
  );
};

export default Header;
