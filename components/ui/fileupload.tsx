"use client";
import { useState , useEffect} from "react";
import { FileUploadOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface FileUploadProps {
  setFile: (file: File) => void;
}
export default function FileUpload({ setFile }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [des, setDes] = useState<string | null>(null);
  const t = useTranslations('moviePage')
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-indigo-600");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-indigo-600");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-indigo-600");

    const file = e.dataTransfer.files[0];
    if (file) displayPreview(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      displayPreview(file); 
      setFile(file)
    };
  };

  const displayPreview = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result as string);
    };
  };

  const updateState = () => {
    if (window.innerWidth < 768) {
      setDes(t('upload_img'))
    } else {
      setDes(t('drop_img'))
    }
  }

  useEffect(() => {
    updateState(); // Initial setup
    window.addEventListener("resize", updateState);

    return () => window.removeEventListener("resize", updateState);
  }, []);

  return (
    <div
      className="w-full md:basis-2/3 content-center max-w-lg aspect-square relative border-2 border-gray-300 border-dashed rounded-lg p-6"
      id="dropzone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role='region'
    >
      {/* File Input */}
      <input
        type="file" aria-label="Upload"
        className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
        onChange={handleFileChange}
        accept="image/*"
      />

      {/* Upload UI */}
      <div className="text-center">
        <FileUploadOutlined />

        <h3 className="mt-2 text-sm font-medium text-gray-900">
          <label className="relative cursor-pointer">
            <span className="bs text-white">{des}</span>
            <input
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              aria-label="Upload"
            />
          </label>
        </h3>

      </div>

      {/* Image Preview */}
      {preview && (
        <img
          src={preview}
          className="mt-4 mx-auto max-h-40"
          alt="Preview"
          role="preview"
        />
      )}
    </div>
  );
}
