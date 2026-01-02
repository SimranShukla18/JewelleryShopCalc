import React from 'react';

const CalculationDisplay = ({ totalAmount }) => {
  return (
    <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-xl text-white">
      <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
      <p className="text-4xl font-bold">₹ {totalAmount}</p>
    </div>
  );
};

export default CalculationDisplay;