import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import * as user from "../function/user.js";

const EditProfileAdmin = ({ onCancel, email, checkImage }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadImage = async () => {
    if (!file) return alert("เลือกไฟล์ก่อนอัปโหลด");
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await user.uploadUser(formData);
      checkImage();
      setFile(null);
      setPreview(null);
      onCancel();
    } catch (err) {
      console.log(err);
      alert("Upload Fail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-semibold">เปลี่ยนรูปโปรไฟล์</h1>
      <div className="relative">
        <img
          src={
            preview
              ? preview
              : `${import.meta.env.VITE_API}/img_users/${email}.jpg?${Date.now()}`
          }
          alt={email}
          className="rounded-full w-[200px] h-[200px] bg-contain"
        />
        <label className="absolute cursor-pointer bottom-0 rounded-full w-12 h-12 flex items-center justify-center right-0 bg-black">
          <FaRegEdit className="text-white text-xl" />
          <input type="file" accept="image/jpeg" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {file && (
        <button
          onClick={handleUploadImage}
          disabled={loading}
          className="px-4 py-2 bg-black text-white font-semibold rounded-md hover:bg-white hover:text-black hover:border transition ease-out duration-200"
        >
          {loading ? "Uploading..." : "อัปโหลดรูป"}
        </button>
      )}

      <button
        onClick={() => {
          setPreview(null);
          setFile(null);
          onCancel();
        }}
        className="px-4 py-2 border-2 rounded-md w-full text-center bg-white hover:border-red-600 transition duration-200 font-semibold"
      >
        ยกเลิก
      </button>
    </div>
  );
};

export default EditProfileAdmin;
