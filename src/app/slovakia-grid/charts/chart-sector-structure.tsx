import React from 'react';

export const EnergyFlowChart = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Generation Layer */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-center mb-4 text-blue-600">
          GENERATION
        </h2>
        <div className="flex justify-center gap-8">
          <div className="bg-white border-2 border-blue-300 rounded-lg p-4 w-48 text-center">
            <div className="font-medium">SEAS</div>
            <div className="text-sm text-gray-600">State 34% • Private 66%</div>
          </div>
          <div className="bg-white border-2 border-blue-300 rounded-lg p-4 w-48 text-center">
            <div className="font-medium">Other Generators</div>
            <div className="text-sm text-gray-600">Various private and public</div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-8">
        <div className="text-2xl text-gray-400">↓</div>
      </div>

      {/* Transmission Layer */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-center mb-4 text-green-600">
          TRANSMISSION
        </h2>
        <div className="flex justify-center">
          <div className="bg-white border-2 border-green-300 rounded-lg p-4 w-48 text-center">
            <div className="font-medium">SEPS</div>
            <div className="text-sm text-gray-600">State 100%</div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-8">
        <div className="text-2xl text-gray-400">↓</div>
      </div>

      {/* Distribution Layer */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-center mb-4 text-purple-600">
          DISTRIBUTION
        </h2>
        <div className="flex justify-center gap-6">
          <div className="bg-white border-2 border-purple-300 rounded-lg p-4 w-44 text-center">
            <div className="font-medium">ZSE</div>
            <div className="text-sm text-gray-600">State 51% • Private 49%</div>
          </div>
          <div className="bg-white border-2 border-purple-300 rounded-lg p-4 w-44 text-center">
            <div className="font-medium">SSE</div>
            <div className="text-sm text-gray-600">State 51% • Private 49%</div>
          </div>
          <div className="bg-white border-2 border-purple-300 rounded-lg p-4 w-44 text-center">
            <div className="font-medium">VSE</div>
            <div className="text-sm text-gray-600">State 51% • Private 49%</div>
          </div>
        </div>
      </div>
    </div>
  );
};