import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true, // ✅ ONLY REQUIRED FIELD
    },

    fullName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
  },
  { timestamps: true }
);

export const Address =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);
