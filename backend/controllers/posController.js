import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';

// @desc    Tạo đơn hàng mới (POS)
// @route   POST /api/pos/orders
// @access  Private/Staff
export const createOrder = async (req, res) => {
    // Lấy thông tin Staff đã được xác thực từ JWT
    const staffId = req.user._id; 
    
    // Dữ liệu cần thiết từ Frontend (Body)
    // orderItems: [{ productId, qty, note }]
    const { orderItems: itemsFromClient, paymentMethod } = req.body;

    if (!itemsFromClient || itemsFromClient.length === 0) {
        return res.status(400).json({ message: 'Không có món hàng nào trong đơn.' });
    }

    try {
        // 1. Lấy thông tin chi tiết (giá) của tất cả sản phẩm trong đơn
        const productIds = itemsFromClient.map(item => item.productId);
        const productsInDB = await Product.find({ _id: { $in: productIds } }).select('name price');
        const productMap = productsInDB.reduce((map, prod) => {
            map[prod._id.toString()] = prod;
            return map;
        }, {});

        let totalOrderPrice = 0;
        const newOrderItems = [];

        // 2. Xử lý và tạo các OrderItem
        for (const clientItem of itemsFromClient) {
            const productInfo = productMap[clientItem.productId];

            if (!productInfo) {
                return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${clientItem.productId}` });
            }

            const itemPrice = productInfo.price;
            
            // Tạo bản ghi OrderItem
            const orderItem = await OrderItem.create({
                product: clientItem.productId,
                name: productInfo.name,
                qty: clientItem.qty,
                price: itemPrice, // Lưu giá cố định tại thời điểm đặt
                note: clientItem.note || ''
            });

            newOrderItems.push(orderItem._id);
            totalOrderPrice += itemPrice * clientItem.qty;
        }

        // 3. Tạo bản ghi Order (Header)
        const order = await Order.create({
            staff: staffId,
            orderItems: newOrderItems,
            totalPrice: totalOrderPrice,
            paymentMethod: paymentMethod || 'Cash',
            // Mặc định: isPaid: false, isCompleted: false
        });

        res.status(201).json({
            message: 'Tạo đơn hàng thành công.',
            orderId: order._id,
            totalPrice: order.totalPrice
        });

    } catch (error) {
        console.error("LỖI KHI TẠO ĐƠN HÀNG:", error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng.', error: error.message });
    }
};

// ... Các hàm khác như updateOrder, payOrder sẽ được thêm vào sau.