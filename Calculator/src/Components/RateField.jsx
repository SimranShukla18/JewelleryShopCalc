import React from 'react';
import { Lock, Unlock } from 'lucide-react';

const RateField = ({ label, value, setValue, field, locked, toggleLock }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => !locked && setValue(e.target.value)}
          disabled={locked}
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            locked ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
          placeholder="0"
        />
        <button
          onClick={() => toggleLock(field)}
          className={`p-2 rounded-lg transition-colors ${
            locked 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {locked ? <Lock size={20} /> : <Unlock size={20} />}
        </button>
      </div>
    </div>
  );
};

export default RateField;