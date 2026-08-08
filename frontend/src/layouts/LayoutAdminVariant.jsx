import ConsoleAdmin from "../components/ConsoleAdmin";
import NavbarAdmin from "../components/NavbarAdmin";
import VariantTable from "../pages/VariantTable";
import ModalVariantAdmin from "../components/ModalVariantAdmin";
import { useEffect, useState } from "react";
import * as variant from "../function/variant.js";
const LayoutAdminVariant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");

  const [variantData, setVariantData] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const res = await variant.getVariant();
      setTableData(res.data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (mode, variant) => {
    setVariantData(variant);
    setModalMode(mode);
    setIsOpen(true);
  };
  const handleSubmit = async (newVariantData) => {
    if (modalMode === "add") {
      try {
        const res = await variant.createVariant(newVariantData);
        setTableData((prevData) => [...prevData, res.data]);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await variant.updateVariant(
          variantData.variant_id,
          newVariantData
        );
        setTableData((prevData) =>
          prevData.map((variant) =>
            variant.variant_id === variantData.variant_id ? res.data : variant
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
          <VariantTable
            tableData={tableData}
            setTableData={setTableData}
            error={error}
            handleOpen={handleOpen}
            searchTerm={searchTerm}
          />
          {isOpen && (
            <>
              <div className="fixed top-0 right-0 z-50 bg-black/50 flex justify-center items-center w-full h-full">
                <div className="bg-white rounded-2xl p-6 w-[500px]">
                  <ModalVariantAdmin
                    onSubmit={handleSubmit}
                    onClose={() => setIsOpen(false)}
                    mode={modalMode}
                    variantData={variantData}
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

export default LayoutAdminVariant;
