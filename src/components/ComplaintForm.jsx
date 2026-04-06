import { useState, useMemo } from 'react';
import { Upload, X, Loader2, Send, Sparkles, Building2, Tag, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { AREAS } from '../data/seedData';
import { analyzeComplaint } from '../utils/prioritize';
import './ComplaintForm.css';

export default function ComplaintForm({ onClose }) {
  const { state, dispatch } = useApp();
  const [area, setArea] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const subCategories = area ? AREAS[area] || [] : [];

  // Live AI analysis preview
  const analysis = useMemo(() => {
    if (description.trim().length < 10) return null;
    return analyzeComplaint(description, area, subCategory);
  }, [description, area, subCategory]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!area || !subCategory || !description.trim()) return;
    setLoading(true);

    setTimeout(() => {
      dispatch({
        type: 'ADD_COMPLAINT',
        payload: {
          title: `${subCategory} in ${area}`,
          description: description.trim(),
          area,
          subCategory,
          studentName: state.user?.name || 'Student',
          image: imagePreview,
        }
      });
      setLoading(false);
      onClose?.();
    }, 600);
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Select Area *</label>
          <select
            className="form-select"
            value={area}
            onChange={(e) => { setArea(e.target.value); setSubCategory(''); }}
            required
          >
            <option value="">Choose area...</option>
            {Object.keys(AREAS).map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Sub-Category *</label>
          <select
            className="form-select"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            disabled={!area}
            required
          >
            <option value="">Choose sub-category...</option>
            {subCategories.map(sc => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Describe the Issue *</label>
        <textarea
          className="form-textarea"
          placeholder="Explain the issue in detail so AI can classify and prioritize it automatically..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />
      </div>

      {/* Live AI Analysis Preview */}
      {analysis && (
        <div className="ai-preview">
          <div className="ai-preview-header">
            <Sparkles size={14} />
            <span>AI Analysis Preview</span>
          </div>
          <div className="ai-preview-grid">
            <div className="ai-preview-item">
              <Tag size={13} />
              <span>Category: <strong>{analysis.category}</strong></span>
            </div>
            <div className="ai-preview-item">
              <Building2 size={13} />
              <span>Routes to: <strong>{analysis.department.name}</strong></span>
            </div>
            <div className="ai-preview-item">
              <span className={`preview-priority priority-${analysis.priority}`}>
                {analysis.priority === 'high' ? '🔴' : analysis.priority === 'medium' ? '🟡' : '🟢'} {analysis.priority.charAt(0).toUpperCase() + analysis.priority.slice(1)} Priority
              </span>
            </div>
            {analysis.urgency.urgent && (
              <div className="ai-preview-item urgent-item">
                <Zap size={13} />
                <span><strong>⚠️ Marked as Urgent</strong> — detected keyword: &quot;{analysis.urgency.keyword}&quot;</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Upload Image (Optional)</label>
        <div className="upload-area">
          {imagePreview ? (
            <div className="image-preview-wrap">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button type="button" className="remove-image" onClick={() => setImagePreview(null)}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="upload-label">
              <Upload size={24} />
              <span>Click to upload an image</span>
              <span className="upload-hint">PNG, JPG up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}
        </div>
      </div>

      <div className="resolve-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !area || !subCategory || !description.trim()}
        >
          {loading ? <><Loader2 size={16} className="spin" /> Submitting...</> : <><Send size={16} /> Submit Complaint</>}
        </button>
      </div>
    </form>
  );
}
