import React, { useRef } from "react";

export type UploadFile = {
  file: File;
  preview: string;
};

export default function ImageUploader({
  files,
  onChange
}: {
  files: UploadFile[];
  onChange: (files: UploadFile[]) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    onChange([...files, ...selected]);
  }

  function remove(index: number) {
    const list = files.filter((_, i) => i !== index);
    onChange(list);
  }

  return (
    <div>
      <button type="button" onClick={() => fileInput.current?.click()}>
        Selecionar imagens
      </button>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleSelect}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {files.map((img, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img
              src={img.preview}
              style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 6 }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "red",
                color: "white",
                borderRadius: "50%",
                border: "none",
                width: 22,
                height: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
