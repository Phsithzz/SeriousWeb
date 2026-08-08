import { useEffect, useState } from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import OrderTable from "../pages/OrderTable";
import ConsoleAdmin from "../components/ConsoleAdmin.jsx";
import * as order from "../function/order.js";
const LayoutAdminOrder = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await order.getOrder();
      setTableData(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Unable to load orders");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex ">
        <div className="w-[20%] bg-black">
          <ConsoleAdmin />
        </div>
        <div className="flex flex-col space-4 w-[80%]">
          <NavbarAdmin showAddButton={false} onSearch={setSearchTerm} />
          <OrderTable
            tableData={tableData}
            error={error}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </>
  );
};

export default LayoutAdminOrder;
