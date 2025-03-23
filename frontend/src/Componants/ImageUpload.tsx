import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { parseAdhar } from '../Api/AdharApi';
import { FaSpinner } from 'react-icons/fa'; 



interface ImageUploadProps {
  handleResponse: (data: any) => void;
}
const ImageUpload: React.FC<ImageUploadProps> = ({ handleResponse }) => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    const allowedFormats = ['image/jpeg', 'image/png', 'application/pdf'];

    if (file) {
      // ✅ Check for valid formats
      if (!allowedFormats.includes(file.type)) {
        toast.error('Only JPEG, PNG, or PDF formats are allowed!');
        return;
      }

      // ✅ Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // ✅ Upload the image
      setImage(file);
    }
  };

  const handleParseAadhar = async () => {
    setLoading(true)
    if (!frontImage || !backImage) {
      toast.error('Please upload both Aadhaar front and back images!');
      return;
    }
    const result = await parseAdhar(frontImage, backImage);
    console.log(result, "result")
    handleResponse(result.data)
    setLoading(false)

  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center">

      <Toaster position="top-center" />

      {/* Aadhaar Front */}
      <div className="bg-slate-200 p-6 rounded-2xl shadow-lg flex flex-col items-center w-[400px] h-[300px] border border-blue-900">
        <p className="mb-4 text-blue-700 font-medium tracking-wide">Aadhaar Front</p>
        <input
          type="file"
          accept="image/jpeg, image/png, application/pdf"
          id="upload-front"
          className="hidden"
          onChange={(e) => handleImageUpload(e, setFrontImage)}
        />
        <label htmlFor="upload-front" className="cursor-pointer">
          <div className="w-64 h-40 bg-slate-300 flex items-center justify-center rounded-lg mb-4">
            {frontImage ? (
              <img src={URL.createObjectURL(frontImage)} alt="Aadhaar Front" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <span className="text-gray-400">Upload Aadhaar Front</span>
            )}
          </div>
        </label>
      </div>

      {/* Aadhaar Back */}
      <div className="bg-slate-200 p-6 rounded-2xl shadow-lg flex flex-col items-center w-[400px] h-[300px] border border-blue-900">
        <p className="mb-4 text-blue-700 font-medium tracking-wide">Aadhaar Back</p>
        <input
          type="file"
          accept="image/jpeg, image/png, application/pdf"
          id="upload-back"
          className="hidden"
          onChange={(e) => handleImageUpload(e, setBackImage)}
        />
        <label htmlFor="upload-back" className="cursor-pointer">
          <div className="w-64 h-40 bg-slate-300 flex items-center justify-center rounded-lg mb-4">
            {backImage ? (
              <img src={URL.createObjectURL(backImage)} alt="Aadhaar Back" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <span className="text-gray-400">Upload Aadhaar Back</span>
            )}
          </div>
        </label>
      </div>

      {/* Parse Aadhaar Button */}
      <button
        onClick={handleParseAadhar}
        disabled={loading}
        className="w-full md:w-[400px] bg-blue-700 hover:bg-blue-500 transition-all text-white p-3 rounded-lg shadow-md font-semibold tracking-wide flex justify-center items-center"
      >
        {loading ?<div>Loading</div>  : 'PARSE AADHAAR'}
      </button>

    </div>

  );
}

export default ImageUpload;
