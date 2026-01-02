
import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

// RateField Component
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

// WeightField Component
const WeightField = ({ label, value, setValue }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="0"
      />
    </div>
  );
};

// CalculationDisplay Component
const CalculationDisplay = ({ totalAmount }) => {
  return (
    <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-xl text-white">
      <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
      <p className="text-4xl font-bold">₹ {totalAmount}</p>
    </div>
  );
};

// Main JewelleryCalculator Component
const JewelleryCalculator = () => {
  const [metalRate, setMetalRate] = useState('');
  const [diamondRate, setDiamondRate] = useState('');
  const [stoneRate, setStoneRate] = useState('');
  const [makingCharges, setMakingCharges] = useState('');
  const [gstOnWhole, setGstOnWhole] = useState('3');
  const [gstOnMaking, setGstOnMaking] = useState('5');
  
  const [metalWeight, setMetalWeight] = useState('');
  const [diamondWeight, setDiamondWeight] = useState('');
  const [stoneWeight, setStoneWeight] = useState('');
  const [discount, setDiscount] = useState('');
  
  const [locks, setLocks] = useState({
    metalRate: false,
    diamondRate: false,
    stoneRate: false,
    makingCharges: false,
    gstOnWhole: false,
    gstOnMaking: false
  });
  
  const [totalAmount, setTotalAmount] = useState(0);
  
  const toggleLock = (field) => {
    setLocks(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  useEffect(() => {
    calculateTotal();
  }, [metalRate, diamondRate, stoneRate, makingCharges, gstOnWhole, gstOnMaking, metalWeight, diamondWeight, stoneWeight, discount]);
  
  const calculateTotal = () => {
    const mw = parseFloat(metalWeight) || 0;
    const dw = parseFloat(diamondWeight) || 0;
    const sw = parseFloat(stoneWeight) || 0;
    const mr = parseFloat(metalRate) || 0;
    const dr = parseFloat(diamondRate) || 0;
    const sr = parseFloat(stoneRate) || 0;
    const mc = parseFloat(makingCharges) || 0;
    const disc = parseFloat(discount) || 0;
    const gstWhole = parseFloat(gstOnWhole) || 0;
    const gstMaking = parseFloat(gstOnMaking) || 0;
    
    // Base calculation
    const metalAmount = mw * mr;
    const diamondAmount = dw * dr;
    const stoneAmount = sw * sr;
    const makingAmount = mc * mw;
    
    // Subtotal before GST
    const subtotal = metalAmount + diamondAmount + stoneAmount + makingAmount;
    
    // GST calculations
    const gstOnWholeAmount = (subtotal * gstWhole) / 100;
    const gstOnMakingAmount = (makingAmount * gstMaking) / 100;
    
    // Total with GST
    const totalWithGst = subtotal + gstOnWholeAmount + gstOnMakingAmount;
    
    // Apply discount
    const discountAmount = (totalWithGst * disc) / 100;
    const finalTotal = totalWithGst - discountAmount;
    
    setTotalAmount(finalTotal.toFixed(2));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          💎 Jewellery Shop Calculator
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rates Section */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rates (Lock to Persist)</h2>
            
            <RateField 
              label="Metal Rate (₹/gram)" 
              value={metalRate} 
              setValue={setMetalRate} 
              field="metalRate"
              locked={locks.metalRate}
              toggleLock={toggleLock}
            />
            
            <RateField 
              label="Diamond Rate (₹/carat)" 
              value={diamondRate} 
              setValue={setDiamondRate} 
              field="diamondRate"
              locked={locks.diamondRate}
              toggleLock={toggleLock}
            />
            
            <RateField 
              label="Stone Rate (₹/piece)" 
              value={stoneRate} 
              setValue={setStoneRate} 
              field="stoneRate"
              locked={locks.stoneRate}
              toggleLock={toggleLock}
            />
            
            <RateField 
              label="Making Charges (₹/gram)" 
              value={makingCharges} 
              setValue={setMakingCharges} 
              field="makingCharges"
              locked={locks.makingCharges}
              toggleLock={toggleLock}
            />
            
            <RateField 
              label="GST on Whole (%)" 
              value={gstOnWhole} 
              setValue={setGstOnWhole} 
              field="gstOnWhole"
              locked={locks.gstOnWhole}
              toggleLock={toggleLock}
            />
            
            <RateField 
              label="GST on Making (%)" 
              value={gstOnMaking} 
              setValue={setGstOnMaking} 
              field="gstOnMaking"
              locked={locks.gstOnMaking}
              toggleLock={toggleLock}
            />
          </div>
          
          {/* Weights Section */}
          <div className="bg-purple-50 p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weights & Discount</h2>
            
            <WeightField 
              label="Metal Weight (grams)" 
              value={metalWeight} 
              setValue={setMetalWeight} 
            />
            
            <WeightField 
              label="Diamond Weight (carats)" 
              value={diamondWeight} 
              setValue={setDiamondWeight} 
            />
            
            <WeightField 
              label="Stone Weight (pieces)" 
              value={stoneWeight} 
              setValue={setStoneWeight} 
            />
            
            <WeightField 
              label="Discount (%)" 
              value={discount} 
              setValue={setDiscount} 
            />
            
            <CalculationDisplay totalAmount={totalAmount} />
          </div>
        </div>
        
        {/* Calculation Breakdown */}
        <div className="mt-6 bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Calculation Formula:</h3>
          <p className="text-sm text-gray-600">
            Total = [(Metal Weight × Metal Rate) + (Diamond Weight × Diamond Rate) + (Stone Weight × Stone Rate) + (Making Charges × Metal Weight)] + GST on Whole + GST on Making - Discount
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <JewelleryCalculator />
    </div>
  );
}

export default App;