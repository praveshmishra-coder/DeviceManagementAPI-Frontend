import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import deviceApi from "../api/deviceApi";

const EditDeviceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ DeviceName: "", Description: null });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await deviceApi.getById(id);
        if (!mounted) return;
        // Expect response shape to match DeviceResponseDTO
        const data = res.data || {};
        setFormData({ DeviceName: data.deviceName ?? data.DeviceName ?? "", Description: data.description ?? data.Description ?? null });
      } catch (err) {
        console.error("Failed to load device:", err);
      } finally {
        mounted && setLoadingInitial(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [id]);

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
    const newValue = name === "Description" && !value.trim() ? null : value;
    setFormData((p) => ({ ...p, [name]: newValue }));
    const fieldError = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: fieldError[name] || null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const dn = validateField("DeviceName", formData.DeviceName);
    if (dn.DeviceName) newErrors.DeviceName = dn.DeviceName;
    if (formData.Description) {
      const de = validateField("Description", formData.Description);
      if (de.Description) newErrors.Description = de.Description;
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      // Backend expects DeviceRequestDTO body (DeviceName, Description)
      await deviceApi.update(id, { DeviceName: formData.DeviceName, Description: formData.Description });
      navigate("/devices");
    } catch (err) {
      console.error("Failed to update device:", err);
      if (err.response?.data?.errors) {
        const backendErrors = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => {
          backendErrors[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(backendErrors);
      } else if (err.response?.data?.title || err.response?.data?.message) {
        setErrors({ general: err.response.data.title || err.response.data.message });
      } else {
        setErrors({ general: "Failed to update device. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return <div className="p-6 text-center text-sm text-gray-600">Loading device...</div>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Device</h2>

          {errors.general && <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">{errors.general}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="DeviceName" className="block text-sm font-medium text-gray-700 mb-1">Device Name <span className="text-red-500">*</span></label>
              <input id="DeviceName" name="DeviceName" value={formData.DeviceName} onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${errors.DeviceName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/40`} maxLength={100} />
              {errors.DeviceName && <p className="mt-1 text-sm text-red-500">{errors.DeviceName}</p>}
            </div>

            <div>
              <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400">(Optional)</span></label>
              <textarea id="Description" name="Description" value={formData.Description || ""} onChange={handleChange} rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${errors.Description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none`} maxLength={250} />
              {errors.Description && <p className="mt-1 text-sm text-red-500">{errors.Description}</p>}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => navigate('/devices')} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDeviceForm;
