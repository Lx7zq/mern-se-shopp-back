const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Object,
      required: true,
    },
    delivery_status: {
      type: String,
      required: true,
      default: "Pending",
    },
    payment_status: {
      type: String,
      required: true,
      default: "Unpaid",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;