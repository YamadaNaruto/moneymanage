import "./addpicture.css"

export default function Addpicture({ file, onChange }) {
  return (
    <div className="upload-area">
      <label className="upload-label">
        <div className="upload-icon">+</div>
        <span className="upload-text">写真を追加</span>
        <span className="upload-hint">レシート・領収書など（任意）</span>
        <input
          className="upload-input"
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files[0])}
        />
      </label>
      {file && (
        <div className="file-selected">
          {file.name}
        </div>
      )}
    </div>
  )
}
