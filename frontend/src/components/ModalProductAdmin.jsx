import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
const ModalProductAdmin = ({ onClose, mode, onSubmit, selectedData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("");
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    if (!selectedFile) {
      setFile(null);

      if (mode === "edit" && selectedData?.image_filename) {
        setPreview(
          `${import.meta.env.VITE_API}/img_products/${
            selectedData.image_filename
          }.jpg`
        );
      } else {
        setPreview(null);
      }
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !brand ||
      !detail ||
      !imageName ||
      !category
    ) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ!",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนดำเนินการ",
        confirmButtonText: "ตกลง",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "cursor-pointer bg-black text-white px-5 py-2 border rounded-md border-white hover:bg-white hover:border hover:text-black hover:border-black transition duration-200",
        },
      });
      return;
    }

    if (mode === "add" && !file) {
      Swal.fire({
        icon: "warning",
        title: "ไม่มีรูปภาพ!",
        text: "กรุณาเพิ่มรูปภาพสำหรับสินค้าใหม่ก่อนบันทึกข้อมูล",
        confirmButtonText: "ตกลง",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "cursor-pointer bg-black text-white px-5 py-2 border rounded-md border-white hover:bg-white hover:border  hover:text-black hover:border-black transition duration-200",
        },
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("stock_quantity", parseInt(stock));
      formData.append("brand", brand);
      formData.append("detail", detail);
      formData.append("image_filename", imageName);
      formData.append("category_name", category);

      if (file) {
        formData.append("image", file);
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (mode === "edit" && selectedData) {
      setName(selectedData.name);
      setDescription(selectedData.description);
      setPrice(selectedData.price);
      setStock(selectedData.stock_quantity);
      setBrand(selectedData.brand);
      setImageName(selectedData.image_filename);
      setCategory(selectedData.category_name);
      setDetail(selectedData.detail);

      if (selectedData.image_filename) {
        setPreview(
          `${import.meta.env.VITE_API}/img_products/${
            selectedData.image_filename
          }.jpg`
        );
      } else {
        setPreview(null);
      }
      setFile(null);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setBrand("");
      setImageName("");
      setCategory("");
      setDetail("");
      setFile(null);
      setPreview(null);
    }
  }, [mode, selectedData]);

  return (
    <>
      <div className="flex flex-col space-y-4">
        <h1 className="text-center text-2xl font-semibold">
          {mode === "add" ? "เพิ่มสินค้า" : "แก้ไขสินค้า"}
        </h1>

        <form onSubmit={handleSubmit} className="flex justify-between  w-full">
          <div className="flex flex-col w-[48%] space-y-4">
            <div className="flex flex-col space-2">
              <label htmlFor="name">ชื่อสินค้า</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 px-2 py-2 rounded-md"
                id="name"
              />
            </div>
            <div className="flex flex-col space-2">
              <label htmlFor="description">หมวดหมู่</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 px-2 py-2 rounded-md"
                id="description"
              />
            </div>

            <div className="flex flex-col space-2">
              <label htmlFor="price">ราคา</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-gray-300 px-2 py-2 rounded-md"
                id="price"
              />
            </div>
            <div className="flex flex-col space-2">
              <label htmlFor="stock">จำนวนสต๊อก</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="border border-gray-300 px-2 py-2 rounded-md"
                id="stock"
              />
            </div>

            <div className="flex flex-col space-2">
              <label htmlFor="brand">แบรนด์</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border border-gray-300 px-2 py-2 rounded-md"
                id="brand"
              />
            </div>
            <div className="flex flex-col space-2">
              <label htmlFor="detail">รายละเอียดสินค้า</label>
              <input
                type="text"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="border border-gray-300 px-2 py-2 rounded-md"
                id="detail"
              />
            </div>

            <div className="flex flex-col space-2">
              <label htmlFor="cate">ประเภทการแสดงผล (show, shoe)</label>
              <select
                id="cate"
                className="border rounded px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">-- เลือกประเภทการแสดงผล --</option>
                <option value="shoe">shoe (สำหรับแสดงในหน้า shoe)</option>
                <option value="show">show (สำหรับแสดงในหน้าแรก)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col w-[48%] space-y-4">
            <div className="flex flex-col space-2">
              <div className="flex flex-col space-2">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="imageName">ชื่อไฟล์รูปภาพ</label>
                  <input
                    type="text"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    id="imageName"
                    className="border border-gray-300 px-2 py-2 rounded-md"
                  />
                </div>

                <label htmlFor="image">รูปภาพ </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border border-gray-300 px-2 py-2 rounded-md"
                  id="image"
                  accept="image/jpeg"
                />
                <div className="flex justify-center mt-6">
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-80 h-80 object-cover rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                {" "}
                {/* เพิ่ม mt-4 ให้ปุ่ม */}
                <button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer px-4 py-2 border-2 w-full hover:border-red-600  transition ease-in duration-200 text-black rounded-md  text-center bg-white  font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  className="cursor-pointer border-2 px-4 py-2 text-white hover:bg-white w-full hover:text-black transition ease-in duration-200 rounded-md  text-center bg-black font-semibold"
                  type="submit"
                >
                  {mode === "add" ? "บันทึกข้อมูล" : "อัปเดตข้อมูล"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalProductAdmin;
