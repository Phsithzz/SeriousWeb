import NavbarAdmin from "../components/NavbarAdmin";
import ConsoleAdmin from "../components/ConsoleAdmin";
import ProductTable from "../pages/ProductTable";
import ModalProductAdmin from "../components/ModalProductAdmin";
import { useEffect, useState } from "react";
import * as product from "../function/product";
//เหลือสร้างfunction backend เพิ่ม
//สร้างcomponent ที่เป็นตอนalert เวลากรอกอะไรไม่ครบ อาจจะเป็นแถบขึ้้นนบนซ้ายบนขวา ใช้library
const LayoutAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await product.getProductAdmin();
      setTableData(res.data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (mode, products) => {
    setSelectedData(products);
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleSubmit = async (newData) => {
    if (modalMode === "add") {
      try {
        const res = await product.createProduct(newData);
        setTableData((prev) => [...prev, res.data]);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await product.updateProduct(
          selectedData.product_id,
          newData
        );
        setTableData((prevData) =>
          prevData.map((p) =>
            p.product_id === selectedData.product_id ? res.data : p
          )
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <div className="flex ">
        <div className="w-[20%] bg-black">
          <ConsoleAdmin />
        </div>
        <div className="flex flex-col space-4 w-[80%]">
          <NavbarAdmin
            onOpen={() => handleOpen("add")}
            onSearch={setSearchTerm}
          />

          <ProductTable
            tableData={tableData}
            setTableData={setTableData}
            error={error}
            handleOpen={handleOpen}
            searchTerm={searchTerm}
          />
          {isOpen && (
            <>
              <div className="fixed top-0 right-0 z-50 bg-black/50 flex justify-center items-center w-full h-full">
                <div className="bg-white rounded-2xl p-6 w-[800px]">
                  <ModalProductAdmin
                    onSubmit={handleSubmit}
                    onClose={() => setIsOpen(false)}
                    mode={modalMode}
                    selectedData={selectedData}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LayoutAdmin;
