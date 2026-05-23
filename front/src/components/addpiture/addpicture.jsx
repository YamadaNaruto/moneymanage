
export default function Addpicture({ file, onChange }) {

  return (
    <div>
      <label>
          画像をアップロード
          <input type="file" onChange={(e) => onChange(e.target.files[0])} />
      </label>
      {file && <p>選択中: {file.name}</p>}
    </div>
  )
}
