import React, { useRef } from "react";

interface CameraComponentProps {
  onCapture: (file: File) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button onClick={openCamera}>Open Camera</button>
    </div>
  );
};

export default CameraComponent;
