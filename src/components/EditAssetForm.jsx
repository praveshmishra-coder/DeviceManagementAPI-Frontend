import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import assetApi from "../api/assetApi";

const EditAssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ AssetName: "", DeviceId: "" });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await assetApi.getById(id);
        const data = res.data || {};
        setFormData({ AssetName: data.assetName ?? data.AssetName ?? "", DeviceId: String(data.deviceId ?? data.DeviceId ?? "") });
      } catch (err) {
        console.error("Failed to load asset:", err);
      } finally {
        mounted && setLoadingInitial(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [id]);

  const validateField = (name, value) => {
    const error = {};
    if (name === "AssetName") {
      if (!value?.trim()) {
        error[name] = "AssetName is required.";
      } else if (value.length < 2 || value.length > 100) {
        error[name] = "AssetName must be between 2 and 100 characters.";
      } else if (!/^[A-Za-z0-9_\-\s]+$/.test(value)) {
        error[name] = "AssetName must be alphanumeric and may include hyphens, underscores, or spaces.";
      }
    }
    if (name === "DeviceId") {
      const n = Number(value);
      if (!value && value !== 0) {
        error[name] = "DeviceId is required.";
      } else if (!Number.isInteger(n) || n <= 0) {
        error[name] = "DeviceId must be a positive integer.";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    const fe = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: fe[name] || null }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.assign(newErrors, validateField("AssetName", formData.AssetName));
    Object.assign(newErrors, validateField("DeviceId", formData.DeviceId));
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
      await assetApi.update(id, { AssetName: formData.AssetName, DeviceId: Number(formData.DeviceId) });
      navigate('/assets');
    } catch (err) {
      console.error('Failed to update asset', err);
      if (err.response?.data?.errors) {
        const backendErrors = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => {
          backendErrors[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(backendErrors);
      } else if (err.response?.data?.title || err.response?.data?.message) {
        setErrors({ general: err.response.data.title || err.response.data.message });
      } else {
        setErrors({ general: 'Failed to update asset. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) return <div className="p-6 text-center text-sm text-gray-600">Loading asset...</div>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Asset</h2>
          {errors.general && <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">{errors.general}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name <span className="text-red-500">*</span></label>
              <input name="AssetName" value={formData.AssetName} onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${errors.AssetName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/40`} maxLength={100} />
              {errors.AssetName && <p className="mt-1 text-sm text-red-500">{errors.AssetName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device ID <span className="text-red-500">*</span></label>
              <input name="DeviceId" value={formData.DeviceId} onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${errors.DeviceId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/40`} />
              {errors.DeviceId && <p className="mt-1 text-sm text-red-500">{errors.DeviceId}</p>}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => navigate('/assets')} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAssetForm;
