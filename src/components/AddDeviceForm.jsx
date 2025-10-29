import { useState } from "react";
import { useNavigate } from "react-router-dom";
import deviceApi from "../api/deviceApi";

const AddDeviceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Match the DeviceRequestDTO structure
  const [formData, setFormData] = useState({
    DeviceName: "",    // Required, 2-100 chars, alphanumeric with - _ space
    Description: null  // Optional, max 250 chars, alphanumeric with .,- _ space
  });

  // Client-side validation to match C# attributes
  const validateField = (name, value) => {
    const error = {};
    
    if (name === "DeviceName") {
      if (!value?.trim()) {
        error[name] = "Device name is required.";
      } else if (value.length < 2 || value.length > 100) {
        error[name] = "Device name must be between 2 and 100 characters.";
      } else if (!/^[A-Za-z0-9_\-\s]+$/.test(value)) {
        error[name] = "Device name must be alphanumeric and may include hyphen, underscore, or space.";
      }
    }
    
    if (name === "Description" && value) {
      if (value.length > 250) {
        error[name] = "Description cannot exceed 250 characters.";
      } else if (!/^[A-Za-z0-9.,\-\s_]*$/.test(value)) {
        error[name] = "Description may contain letters, numbers, spaces, dots, commas, hyphens, and underscores.";
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For Description, convert empty string to null to match DTO
    const newValue = name === "Description" && !value.trim() ? null : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate on change and update errors
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError[name] || null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate DeviceName (required)
    const deviceNameErrors = validateField("DeviceName", formData.DeviceName);
    if (deviceNameErrors.DeviceName) {
      newErrors.DeviceName = deviceNameErrors.DeviceName;
    }
    
    // Validate Description (optional)
    if (formData.Description) {
      const descriptionErrors = validateField("Description", formData.Description);
      if (descriptionErrors.Description) {
        newErrors.Description = descriptionErrors.Description;
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run client-side validation first
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await deviceApi.add(formData);
      navigate("/devices");
    } catch (err) {
      console.error("Failed to add device:", err);
      
      // Handle ASP.NET Core validation response
      if (err.response?.data?.errors) {
        const backendErrors = {};
        // Handle both single string and string array error messages
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(backendErrors);
      } else if (err.response?.data?.title || err.response?.data?.message) {
        // Handle general API error messages
        setErrors({ 
          general: err.response.data.title || err.response.data.message || "Failed to add device. Please try again." 
        });
      } else {
        setErrors({ general: "Failed to add device. Please try again." });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Device</h2>

          {errors.general && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="DeviceName" className="block text-sm font-medium text-gray-700 mb-1">
                Device Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="DeviceName"
                name="DeviceName"
                value={formData.DeviceName}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.DeviceName
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-primary/40"
                } focus:outline-none focus:ring-2 transition-shadow`}
                placeholder="Enter device name (2-100 characters, alphanumeric with - _ space)"
                maxLength={100}
              />
              {errors.DeviceName && (
                <p className="mt-1 text-sm text-red-500">{errors.DeviceName}</p>
              )}
            </div>

            <div>
              <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description || ""} /* Handle null value */
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.Description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-primary/40"
                } focus:outline-none focus:ring-2 transition-shadow resize-none`}
                placeholder="Enter device description (up to 250 characters)"
                maxLength={250}
              />
              {errors.Description && (
                <p className="mt-1 text-sm text-red-500">{errors.Description}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/devices")}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              >
                {loading ? "Saving..." : "Save Device"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceForm;