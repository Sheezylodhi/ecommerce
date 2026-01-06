import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
  type: String,
  required: true,
},

    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        color: String,
        size: String,
        image: { type: String, required: true },
      },
    ],

    totalAmount: Number,
    orderNumber: String,
    paymentStatus: { type: String, default: "pending" },
    deliveryStatus: { type: String, default: "pending" },
    stripeSessionId: String,

    customerName: String,
    phone: String,
    address: String,
    city: String,
    country: String,

    billingAddress: String,
    billingCity: String,
    billingCountry: String,

    paymentMethod: { type: String, default: "card" },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
