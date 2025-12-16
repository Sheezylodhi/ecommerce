import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
  },
  { collection: "addresses", timestamps: true }
);

export const Address =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);
