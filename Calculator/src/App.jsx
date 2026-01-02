import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, AlertCircle, RefreshCw, Save, Download } from 'lucide-react';

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
};

// Validation helper
const validateInput = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const numValue = parseFloat(value) || 0;
  if (numValue < min) return min;
  if (numValue > max) return max;
  return numValue;
};

// RateField Component
const RateField = ({ label, value, setValue, field, locked, toggleLock, min = 0, max = 10000000, step = "0.01", error = null }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {error && (
          <span className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => !locked && setValue(e.target.value)}
          disabled={locked}
          min={min}
          max={max}
          step={step}
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            locked ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${error ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="0"
        />
        <button
          type="button"
          onClick={() => toggleLock(field)}
          className={`p-2 rounded-lg transition-colors ${
            locked 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          aria-label={locked ? `Unlock ${label}` : `Lock ${label}`}
        >
          {locked ? <Lock size={20} /> : <Unlock size={20} />}
        </button>
      </div>
    </div>
  );
};

// WeightField Component
const WeightField = ({ label, value, setValue, min = 0, max = 10000, step = "0.001", error = null }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {error && (
          <span className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </span>
        )}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder="0"
      />
    </div>
  );
};

// CalculationDisplay Component
const CalculationDisplay = ({ totalAmount, breakdown }) => {
  return (
    <div className="mt-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
        <p className="text-4xl font-bold">₹ {formatCurrency(totalAmount)}</p>
      </div>
      
      {breakdown && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Cost Breakdown:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Metal Cost:</span>
              <span>₹ {formatCurrency(breakdown.metalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Diamond Cost:</span>
              <span>₹ {formatCurrency(breakdown.diamondAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Stone Cost:</span>
              <span>₹ {formatCurrency(breakdown.stoneAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Making Charges:</span>
              <span>₹ {formatCurrency(breakdown.makingAmount)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Subtotal:</span>
              <span>₹ {formatCurrency(breakdown.subtotal)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>GST on Whole ({breakdown.gstWhole}%):</span>
              <span>₹ {formatCurrency(breakdown.gstOnWholeAmount)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>GST on Making ({breakdown.gstMaking}%):</span>
              <span>₹ {formatCurrency(breakdown.gstOnMakingAmount)}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Total with GST:</span>
              <span>₹ {formatCurrency(breakdown.totalWithGst)}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Discount ({breakdown.discount}%):</span>
              <span>- ₹ {formatCurrency(breakdown.discountAmount)}</span>
            </div>
            <div className="border-t pt-1 mt-1 font-semibold">
              <div className="flex justify-between">
                <span>Final Total:</span>
                <span>₹ {formatCurrency(breakdown.finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, type = 'info', onClose }) => {
  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 border ${bgColor} px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
      {type === 'error' && <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-gray-600 hover:text-gray-900">
        ✕
      </button>
    </div>
  );
};

// Main JewelleryCalculator Component
const JewelleryCalculator = () => {
  // State Management
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
  const [breakdown, setBreakdown] = useState(null);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [calculationHistory, setCalculationHistory] = useState([]);

  // Validate all inputs
  const validateAllInputs = useCallback(() => {
    const newErrors = {};
    
    // Validate rates
    if (validateInput(metalRate, 0, 10000000) === 0 && metalRate !== '') {
      newErrors.metalRate = 'Must be positive';
    }
    if (validateInput(diamondRate, 0, 100000000) === 0 && diamondRate !== '') {
      newErrors.diamondRate = 'Must be positive';
    }
    if (validateInput(stoneRate, 0, 1000000) === 0 && stoneRate !== '') {
      newErrors.stoneRate = 'Must be positive';
    }
    if (validateInput(makingCharges, 0, 1000000) === 0 && makingCharges !== '') {
      newErrors.makingCharges = 'Must be positive';
    }
    
    // Validate weights
    if (validateInput(metalWeight, 0.001, 10000) === 0.001 && metalWeight !== '') {
      newErrors.metalWeight = 'Minimum 0.001g';
    }
    if (validateInput(diamondWeight, 0, 1000) < 0) {
      newErrors.diamondWeight = 'Cannot be negative';
    }
    if (validateInput(stoneWeight, 0, 10000) < 0) {
      newErrors.stoneWeight = 'Cannot be negative';
    }
    
    // Validate percentages
    if (validateInput(gstOnWhole, 0, 100) > 100) {
      newErrors.gstOnWhole = 'Max 100%';
    }
    if (validateInput(gstOnMaking, 0, 100) > 100) {
      newErrors.gstOnMaking = 'Max 100%';
    }
    if (validateInput(discount, 0, 100) > 100) {
      newErrors.discount = 'Max 100% discount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [metalRate, diamondRate, stoneRate, makingCharges, metalWeight, diamondWeight, stoneWeight, gstOnWhole, gstOnMaking, discount]);

  // Enhanced calculation with validation
  const calculateTotal = useCallback(() => {
    if (!validateAllInputs()) {
      setToast({ message: 'Please fix validation errors', type: 'error' });
      return;
    }

    try {
      // Parse and validate inputs with constraints
      const mw = validateInput(metalWeight, 0.001, 10000);
      const dw = validateInput(diamondWeight, 0, 1000);
      const sw = validateInput(stoneWeight, 0, 10000);
      const mr = validateInput(metalRate, 0, 10000000);
      const dr = validateInput(diamondRate, 0, 100000000);
      const sr = validateInput(stoneRate, 0, 1000000);
      const mc = validateInput(makingCharges, 0, 1000000);
      const disc = validateInput(discount, 0, 100); // Cap discount at 100%
      const gstWhole = validateInput(gstOnWhole, 0, 100);
      const gstMaking = validateInput(gstOnMaking, 0, 100);
      
      // Base calculation
      const metalAmount = mw * mr;
      const diamondAmount = dw * dr;
      const stoneAmount = sw * sr;
      const makingAmount = mc * mw;
      
      // Subtotal before GST
      const otherSubtotal = metalAmount + diamondAmount + stoneAmount;
const subtotal = otherSubtotal + makingAmount;
      // GST calculations
      const gstOnWholeAmount = (otherSubtotal * gstWhole) / 100;
const gstOnMakingAmount = (makingAmount * gstMaking) / 100;
      // Total with GST
      const totalWithGst =
      otherSubtotal +
      makingAmount +
      gstOnWholeAmount +
      gstOnMakingAmount;

      // Apply discount (capped to prevent negative values)
      const safeDiscount = isNaN(disc) || disc <= 0 ? 0 : disc;

      // Apply discount (cannot exceed total)
      const discountAmount = Math.min(
      (totalWithGst * safeDiscount) / 100,
      totalWithGst
    );

const finalTotal = Math.max(totalWithGst - discountAmount, 0);

      // Create breakdown object
      const breakdownObj = {
        metalAmount,
        diamondAmount,
        stoneAmount,
        makingAmount,
        subtotal,
        gstWhole,
        gstOnWholeAmount,
        gstMaking,
        gstOnMakingAmount,
        totalWithGst,
        discount: disc,
        discountAmount,
        finalTotal
      };
      
      setTotalAmount(finalTotal);
      setBreakdown(breakdownObj);
      
      // Add to history
      setCalculationHistory(prev => [{
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        total: finalTotal,
        breakdown: breakdownObj
      }, ...prev.slice(0, 9)]); // Keep last 10 calculations
      
    } catch (error) {
      console.error('Calculation error:', error);
      setToast({ message: 'Calculation error. Please check inputs.', type: 'error' });
    }
  }, [metalRate, diamondRate, stoneRate, makingCharges, gstOnWhole, gstOnMaking, metalWeight, diamondWeight, stoneWeight, discount, validateAllInputs]);

  // Effect to calculate on input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateTotal();
    }, 300); // Debounce calculation by 300ms
    
    return () => clearTimeout(timer);
  }, [calculateTotal]);

  const toggleLock = (field) => {
    setLocks(prev => ({ ...prev, [field]: !prev[field] }));
    setToast({ message: `${field} ${locks[field] ? 'unlocked' : 'locked'}`, type: 'info' });
  };

  
 
   

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            💎 Jewellery Shop Calculator
          </h1>
         
        </div>
        
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
              min="0"
              max="10000000"
              step="0.01"
              error={errors.metalRate}
            />
            
            <RateField 
              label="Diamond Rate (₹/carat)" 
              value={diamondRate} 
              setValue={setDiamondRate} 
              field="diamondRate"
              locked={locks.diamondRate}
              toggleLock={toggleLock}
              min="0"
              max="100000000"
              step="0.01"
              error={errors.diamondRate}
            />
            
            <RateField 
              label="Stone Rate (₹/piece)" 
              value={stoneRate} 
              setValue={setStoneRate} 
              field="stoneRate"
              locked={locks.stoneRate}
              toggleLock={toggleLock}
              min="0"
              max="1000000"
              step="0.01"
              error={errors.stoneRate}
            />
            
            <RateField 
              label="Making Charges (₹/gram)" 
              value={makingCharges} 
              setValue={setMakingCharges} 
              field="makingCharges"
              locked={locks.makingCharges}
              toggleLock={toggleLock}
              min="0"
              max="1000000"
              step="0.01"
              error={errors.makingCharges}
            />
            
            <RateField 
              label="GST on Whole (%)" 
              value={gstOnWhole} 
              setValue={setGstOnWhole} 
              field="gstOnWhole"
              locked={locks.gstOnWhole}
              toggleLock={toggleLock}
              min="0"
              max="100"
              step="0.01"
              error={errors.gstOnWhole}
            />
            
            <RateField 
              label="GST on Making (%)" 
              value={gstOnMaking} 
              setValue={setGstOnMaking} 
              field="gstOnMaking"
              locked={locks.gstOnMaking}
              toggleLock={toggleLock}
              min="0"
              max="100"
              step="0.01"
              error={errors.gstOnMaking}
            />
          </div>
          
          {/* Weights Section */}
          <div className="bg-purple-50 p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weights & Discount</h2>
            
            <WeightField 
              label="Metal Weight (grams)" 
              value={metalWeight} 
              setValue={setMetalWeight}
              min="0.001"
              max="10000"
              step="0.001"
              error={errors.metalWeight}
            />
            
            <WeightField 
              label="Diamond Weight (carats)" 
              value={diamondWeight} 
              setValue={setDiamondWeight}
              min="0"
              max="1000"
              step="0.001"
              error={errors.diamondWeight}
            />
            
            <WeightField 
              label="Stone Weight (pieces)" 
              value={stoneWeight} 
              setValue={setStoneWeight}
              min="0"
              max="10000"
              step="1"
              error={errors.stoneWeight}
            />
            
            <WeightField 
              label="Discount (%)" 
              value={discount} 
              setValue={setDiscount}
              min="0"
              max="100"
              step="0.01"
              error={errors.discount}
            />
            
            <CalculationDisplay totalAmount={totalAmount} breakdown={breakdown} />
          </div>
        </div>
        
        {/* History Section */}
        {calculationHistory.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Calculations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Metal (g)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Diamond (ct)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Discount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calculationHistory.map((calc) => (
                    <tr key={calc.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 text-sm">{calc.timestamp}</td>
                      <td className="px-4 py-2 text-sm">{metalWeight}</td>
                      <td className="px-4 py-2 text-sm">{diamondWeight}</td>
                      <td className="px-4 py-2 text-sm">{discount}%</td>
                      <td className="px-4 py-2 text-sm font-semibold">₹ {formatCurrency(calc.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Calculation Breakdown */}
        <div className="mt-6 bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Calculation Formula:</h3>
          <p className="text-sm text-gray-600 mb-3">
            Total = [(Metal Weight × Metal Rate) + (Diamond Weight × Diamond Rate) + (Stone Weight × Stone Rate) + (Making Charges × Metal Weight)] + GST on Whole + GST on Making - Discount
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Discount is capped at 100% to prevent negative totals</p>
            <p>• All inputs are validated with appropriate min/max values</p>
            <p>• Calculations are debounced for performance</p>
            <p>• Rates can be locked for persistence across calculations</p>
          </div>
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