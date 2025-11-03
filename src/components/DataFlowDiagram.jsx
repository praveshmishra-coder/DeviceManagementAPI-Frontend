import React from 'react';

const DataFlowDiagram = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">System Architecture Flow Diagram</h2>
      <div className="space-y-4">
        {/* Client Layer */}
        <div className="border-2 p-4 rounded-lg bg-blue-50">
          <h3 className="font-bold">1️⃣ CLIENT (React / Swagger)</h3>
          <div className="ml-4 mt-2">
            <p>• Sends HTTP Request (GET / POST / PUT / DELETE)</p>
            <p>• Waits for JSON Response</p>
          </div>
        </div>
        <div className="text-center">↓</div>

        {/* Middleware Layer */}
        <div className="border-2 p-4 rounded-lg bg-green-50">
          <h3 className="font-bold">2️⃣ CUSTOM MIDDLEWARE (ErrorHandling)</h3>
          <div className="ml-4 mt-2">
            <p>• Logs request path and method</p>
            <p>• Handles global exceptions</p>
            <p>• Passes request to next layer</p>
          </div>
        </div>
        <div className="text-center">↓</div>

        {/* Controller Layer */}
        <div className="border-2 p-4 rounded-lg bg-yellow-50">
          <h3 className="font-bold">3️⃣ CONTROLLER LAYER</h3>
          <div className="ml-4 mt-2">
            <p>• Receives HTTP request</p>
            <p>• Validates input (ModelState)</p>
            <p>• Calls Repository layer</p>
            <p>• Uses try/catch for validation errors</p>
          </div>
        </div>
        <div className="text-center">↓</div>

        {/* Repository Layer */}
        <div className="border-2 p-4 rounded-lg bg-purple-50">
          <h3 className="font-bold">4️⃣ REPOSITORY / SERVICE LAYER</h3>
          <div className="ml-4 mt-2">
            <p>• Implements IDeviceRepository interface</p>
            <p>• Contains business logic</p>
            <p>• Calls DatabaseHelper for data operations</p>
            <p>• Handles DB exceptions with try/catch</p>
          </div>
        </div>
        <div className="text-center">↓</div>

        {/* Data Access Layer */}
        <div className="border-2 p-4 rounded-lg bg-red-50">
          <h3 className="font-bold">5️⃣ DATA ACCESS LAYER (DatabaseHelper)</h3>
          <div className="ml-4 mt-2">
            <p>• Uses ADO.NET (SqlConnection, SqlCommand)</p>
            <p>• Executes SQL queries (CRUD)</p>
            <p>• Maps result to C# models</p>
          </div>
        </div>
        <div className="text-center">↓</div>

        {/* Database Layer */}
        <div className="border-2 p-4 rounded-lg bg-gray-50">
          <h3 className="font-bold">6️⃣ SQL SERVER DATABASE</h3>
          <div className="ml-4 mt-2">
            <p>• Stores and retrieves data</p>
            <p>• Tables: Devices, Assets, SignalMeasurements</p>
          </div>
        </div>
        <div className="text-center">↓</div>

        {/* Return Flow */}
        <div className="border-2 p-4 rounded-lg bg-indigo-50">
          <h3 className="font-bold">7️⃣ RETURN FLOW (Reverse Order)</h3>
          <div className="ml-4 mt-2">
            <p>• Database → DAL → Repository → Controller → Client</p>
            <p>• Each layer returns data/result upward</p>
          </div>
        </div>
        <div className="text-center">↓</div>

        {/* DI Container */}
        <div className="border-2 p-4 rounded-lg bg-pink-50">
          <h3 className="font-bold">9️⃣ PROGRAM.CS (DI CONTAINER)</h3>
          <div className="ml-4 mt-2">
            <p>• Executes once during app startup</p>
            <p>• Registers dependencies:</p>
            <p className="ml-4">- AddScoped&lt;IDeviceRepository, DeviceRepository&gt;()</p>
            <p className="ml-4">- AddScoped&lt;DatabaseHelper&gt;()</p>
            <p>• Adds middleware pipeline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowDiagram;