import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './ResolveForm.css';

export default function ResolveForm({ complaint, onClose }) {
  const { dispatch } = useApp();
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (!description.trim()) return;
    setLoading(true);

    // Simulate async resolution
    setTimeout(() => {
      dispatch({
        type: 'RESOLVE_COMPLAINT',
        payload: {
          id: complaint.id,
          description: description.trim(),
          image: imagePreview,
        }
      });
      setLoading(false);
      onClose?.();
    }, 800);
  };

  return (
    <form className="resolve-form" onSubmit={handleSubmit}>
      <div className="resolve-info">
        <span className="resolve-label">Resolving:</span>
        <span className="resolve-title">{complaint.title}</span>
      </div>

      <div className="form-group">
        <label className="form-label">Description of Fix *</label>
        <textarea
          className="form-textarea"
          placeholder="Describe what was done to resolve this complaint..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

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
              <span>Click to upload</span>
              <span className="upload-hint">PNG, JPG up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}
        </div>
      </div>

      <div className="resolve-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading || !description.trim()}>
          {loading && <Loader2 size={16} className="spin" />}
          {loading ? 'Resolving...' : 'Mark as Resolved'}
        </button>
      </div>
    </form>
  );
}
