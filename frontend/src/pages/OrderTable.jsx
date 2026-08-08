const OrderTable = ({ tableData, error, searchTerm }) => {
  const query = searchTerm.toLowerCase();
  const filteredData = tableData.filter(
    (item) =>
      item?.customer_email?.toLowerCase().includes(query) ||
      item?.payment_method?.toLowerCase().includes(query)
  );

  return (
    <div className="overflow-x-auto p-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full min-w-[800px] border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-center text-sm font-medium uppercase text-gray-500">Order ID</th>
              <th className="px-4 py-3 text-center text-sm font-medium uppercase text-gray-500">Customer</th>
              <th className="px-4 py-3 text-center text-sm font-medium uppercase text-gray-500">Total</th>
              <th className="px-4 py-3 text-center text-sm font-medium uppercase text-gray-500">Status</th>
              <th className="px-4 py-3 text-center text-sm font-medium uppercase text-gray-500">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {filteredData.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-center text-sm font-medium">{order.order_id}</td>
                <td className="px-4 py-4 text-center text-sm font-medium">{order.customer_email}</td>
                <td className="px-4 py-4 text-center text-sm font-medium">{order.total_price}</td>
                <td className="px-4 py-4 text-center text-sm text-gray-700">
                  {order.status ? "Paid" : "Pending"}
                </td>
                <td className="px-4 py-4 text-center text-sm text-gray-700">{order.payment_method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
