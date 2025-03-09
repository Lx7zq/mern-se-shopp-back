const OrderModel = require("../models/Order");
// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().populate("products.productId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.findById(id).populate("products.productId");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order by ID
exports.updateDeliveryStatus = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({ message: "id is required" });
    }
    try {
        const orderDeliveryDetail = await OrderModel.findById(id);
        if (!orderDeliveryDetail) {
            return res.status(404).json({ message: "Order not found" });
        }
        const { delivery_status } = req.body;
        if (!delivery_status) {
            return res.status(400).json({ message: "deliver_status is require" });
        }
        orderDeliveryDetail.delivery_status = delivery_status;
        await orderDeliveryDetail.save();
        res.json(orderDeliveryDetail);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "Something error occurred while Updating order detail",
        });
    }
};

// Delete order by ID
exports.deleteOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await OrderModel.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};