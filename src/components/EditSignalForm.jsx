import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import signalApi from "../api/signalApi";

const EditSignalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    SignalTag: "",
    RegisterAddress: "",
    AssetId: ""
  });

  // ✅ Fetch signal details on load
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await signalApi.getById(id);
        const data = res.data || {};
        setFormData({
          SignalTag: data.signalTag ?? data.SignalTag ?? "",
          RegisterAddress: data.registerAddress ?? data.RegisterAddress ?? "",
          AssetId: String(data.assetId ?? data.AssetId ?? "")
        });
      } catch (err) {
        console.error("Failed to load signal:", err);
      } finally {
        mounted && setLoadingInitial(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [id]);

  // ✅ Field-level validation
  const validateField = (name, value) => {
    const error = {};

    if (name === "SignalTag") {
      if (!value?.trim()) {
        error[name] = "SignalTag is required.";
      } else if (value.length < 2 || value.length > 100) {
        error[name] = "SignalTag must be between 2 and 100 characters.";
      } else if (!/^[A-Za-z0-9_\-\s]+$/.test(value)) {
        error[name] =
          "SignalTag must be alphanumeric and may include hyphens, underscores, or spaces.";
      }
    }

    if (name === "RegisterAddress") {
      if (!value?.trim()) {
        error[name] = "RegisterAddress is required.";
      } else if (value.length < 1 || value.length > 50) {
        error[name] = "RegisterAddress must be between 1 and 50 characters.";
      } else if (!/^[A-Za-z0-9_\-]+$/.test(value)) {
        error[name] =
          "RegisterAddress must be alphanumeric and may include hyphen or underscore.";
      }
    }

    if (name === "AssetId") {
      const n = Number(value);
      if (!value && value !== 0) {
        error[name] = "AssetId is required.";
      } else if (!Number.isInteger(n) || n <= 0) {
        error[name] = "AssetId must be a positive integer.";
      }
    }

    return error;
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    const fieldError = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: fieldError[name] || null }));
  };

  // ✅ Form validation
  const validateForm = () => {
    const newErrors = {};
    Object.assign(newErrors, validateField("SignalTag", formData.SignalTag));
    Object.assign(newErrors, validateField("RegisterAddress", formData.RegisterAddress));
    Object.assign(newErrors, validateField("AssetId", formData.AssetId));
    return newErrors;
  };

  // ✅ Submit updated data
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
      await signalApi.update(id, {
        SignalTag: formData.SignalTag,
        RegisterAddress: formData.RegisterAddress,
        AssetId: Number(formData.AssetId),
      });
      navigate("/signals");
    } catch (err) {
      console.error("Failed to update signal", err);
      if (err.response?.data?.errors) {
        const backendErrors = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => {
          backendErrors[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(backendErrors);
      } else if (err.response?.data?.title || err.response?.data?.message) {
        setErrors({ general: err.response.data.title || err.response.data.message });
      } else {
        setErrors({ general: "Failed to update signal. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state
  if (loadingInitial)
    return <div className="p-6 text-center text-sm text-gray-600">Loading signal...</div>;

  // ✅ UI
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Signal</h2>
          {errors.general && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* SignalTag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signal Tag <span className="text-red-500">*</span>
              </label>
              <input
                name="SignalTag"
                value={formData.SignalTag}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.SignalTag ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                maxLength={100}
              />
              {errors.SignalTag && (
                <p className="mt-1 text-sm text-red-500">{errors.SignalTag}</p>
              )}
            </div>

            {/* RegisterAddress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Register Address <span className="text-red-500">*</span>
              </label>
              <input
                name="RegisterAddress"
                value={formData.RegisterAddress}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.RegisterAddress ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                maxLength={50}
              />
              {errors.RegisterAddress && (
                <p className="mt-1 text-sm text-red-500">{errors.RegisterAddress}</p>
              )}
            </div>

            {/* AssetId */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset ID <span className="text-red-500">*</span>
              </label>
              <input
                name="AssetId"
                value={formData.AssetId}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.AssetId ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary/40`}
              />
              {errors.AssetId && (
                <p className="mt-1 text-sm text-red-500">{errors.AssetId}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/signals")}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSignalForm;
