"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ReportsPage() {
  const [reportData, setReportData] = useState([]);
  const [overallEarning, setOverallEarning] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/admin/reports");
        const data = await res.json();
        setReportData(data.report || []);
        setOverallEarning(data.overallEarning || 0);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const downloadProductPDF = (product) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Product Sales Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Product: ${product.name}`, 14, 35);
    doc.text(`Sold Quantity: ${product.totalQuantity}`, 14, 45);
    doc.text(`Total Earning: $${product.totalEarning.toFixed(2)}`, 14, 55);

    if (product.image) {
      doc.addImage(product.image, "JPEG", 150, 25, 40, 40);
    }

    doc.save(`${product.name}_report.pdf`);
  };

  const downloadFullReportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Overall Sales Report", 14, 20);

    const tableData = reportData.map((p) => [
      p.name,
      p.totalQuantity,
      `$${p.totalEarning.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: 30,
      head: [["Product", "Quantity", "Earning"]],
      body: tableData,
    });

    doc.setFontSize(14);
    doc.text(
      `Overall Total Earning: $${overallEarning.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 20
    );
    doc.save("Overall_Report.pdf");
  };

  if (loading) return <p className="text-center mt-10">Loading report...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Sales Reports</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={downloadFullReportPDF}
      >
        Download Full Report PDF
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Image</th>
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Sold Quantity</th>
              <th className="border px-2 py-1">Total Earning ($)</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((p) => (
              <tr key={p.productId} className="border-b">
                <td className="border px-2 py-1">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border px-2 py-1">{p.name}</td>
                <td className="border px-2 py-1">{p.totalQuantity}</td>
                <td className="border px-2 py-1">
                  ${p.totalEarning.toFixed(2)}
                </td>
                <td className="border px-2 py-1">
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                    onClick={() => downloadProductPDF(p)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100">
              <td colSpan={3} className="border px-2 py-2 text-right">
                Overall Total Earning:
              </td>
              <td className="border px-2 py-2">${overallEarning.toFixed(2)}</td>
              <td className="border"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
