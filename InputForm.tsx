import React, { useState } from 'react';
import { Search, Mail, Phone } from 'lucide-react';

interface InputFormProps {
  onSearch: (email: string, phoneNumber: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSearch, isLoading }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() || phoneNumber.trim()) {
      onSearch(email.trim(), phoneNumber.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <Search className="w-5 h-5 mr-2" />
        Investigation Query
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || (!email && !phoneNumber)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Analyzing Sources...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Start Investigation
            </>
          )}
        </button>
      </form>

      {/* Loading Progress */}
      {isLoading && (
        <div className="mt-6 space-y-3">
          <div className="text-sm text-slate-600">Checking sources...</div>
          <div className="space-y-2">
            <div className="flex items-center text-xs text-slate-500">
              <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
              HaveIBeenPwned API
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
              GitHub Public Profiles
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
              WHOIS Database
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
              Phone Carrier Lookup
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;