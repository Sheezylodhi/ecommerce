"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/address/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAddresses(data.addresses || []);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/address/${editingId}`
      : "/api/address/save";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({ fullName: "", phone: "", address: "", city: "", country: "" });
    setEditingId(null);
    setShowForm(false);
    fetchAddresses();
  };

  const editAddress = (addr) => {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      country: addr.country,
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  const deleteAddress = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/address/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
  };

  return (
    <div className="min-h-screen bg-white font-serif flex flex-col">
      <Navbar />

      <div className="max-w-3xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mt-20 mx-auto p-4 sm:p-6 flex-1">

        {/* BACK TO ACCOUNT */}
        <button
          onClick={() => router.push("/profile")}
          className="text-sm text-gray-500 hover:text-black transition mb-6"
        >
          ← Back to My Account
        </button>

        <h1 className="text-2xl sm:text-3xl font-medium mb-10 text-center">
          My Addresses
        </h1>

        {/* CENTERED ADD BUTTON */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-black text-white hover:bg-gray-800 transition"
          >
            {showForm ? "Close Form" : "Add New Address"}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="mb-12 space-y-4">
            {["fullName", "phone", "address", "city", "country"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                onChange={handleChange}
                className="w-full py-2 sm:py-3 px-2 sm:px-3 outline-none border-b border-gray-300 focus:border-black transition"
              />
            ))}

            <button
              onClick={saveAddress}
              className="mt-6 px-6 sm:px-8 py-2 sm:py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition w-full sm:w-auto"
            >
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        )}

        {/* ADDRESSES LIST */}
        <div className="space-y-8">
          {addresses.map((addr, i) => (
            <div key={addr._id} className="px-4 sm:px-6 py-4 border rounded-md shadow-sm hover:shadow-md transition">
              <p className="font-medium text-base sm:text-lg">{addr.fullName}</p>
              <p className="text-sm sm:text-base text-gray-600 leading-6 mt-1">
                {addr.address}<br />
                {addr.city}<br />
                {addr.country}<br />
                {addr.phone}
              </p>

              <div className="mt-4 flex gap-4 flex-wrap">
                <button
                  onClick={() => editAddress(addr)}
                  className="text-sm sm:text-base text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAddress(addr._id)}
                  className="text-sm sm:text-base text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>

              {i !== addresses.length - 1 && (
                <hr className="mt-6 border-gray-200" />
              )}
            </div>
          ))}

          {addresses.length === 0 && (
            <p className="text-gray-500 text-center text-sm sm:text-base">
              No addresses found. Add one above.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
