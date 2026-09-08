const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
};

// Sample order data (replace with actual database queries)
const getOrdersData = () => {
    return [
        {
            _id: '6701234567890abcdef12345',
            status: 'delivered',
            createdAt: new Date('2024-08-15'),
            deliveryDate: new Date('2024-08-20'),
            items: [
                {
                    productName: 'Wireless Headphones',
                    quantity: 1,
                    price: 2499
                },
                {
                    productName: 'USB-C Cable',
                    quantity: 2,
                    price: 599
                }
            ],
            deliveryAddress: {
                street: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra'
            },
            subtotal: 3598,
            shippingCost: 50,
            discount: 0,
            totalAmount: 3648,
            paymentMethod: 'Credit Card'
        },
        {
            _id: '6701234567890abcdef12346',
            status: 'shipped',
            createdAt: new Date('2024-09-01'),
            deliveryDate: new Date('2024-09-05'),
            items: [
                {
                    productName: 'Smart Watch',
                    quantity: 1,
                    price: 4999
                }
            ],
            deliveryAddress: {
                street: '456 Park Avenue',
                city: 'Delhi',
                state: 'Delhi'
            },
            subtotal: 4999,
            shippingCost: 100,
            discount: 500,
            totalAmount: 4599,
            paymentMethod: 'UPI'
        },
        {
            _id: '6701234567890abcdef12347',
            status: 'confirmed',
            createdAt: new Date('2024-09-10'),
            deliveryDate: new Date('2024-09-15'),
            items: [
                {
                    productName: 'Laptop Stand',
                    quantity: 1,
                    price: 1999
                },
                {
                    productName: 'Keyboard',
                    quantity: 1,
                    price: 2499
                },
                {
                    productName: 'Mouse',
                    quantity: 1,
                    price: 999
                }
            ],
            deliveryAddress: {
                street: '789 Tech Street',
                city: 'Bangalore',
                state: 'Karnataka'
            },
            subtotal: 5497,
            shippingCost: 75,
            discount: 200,
            totalAmount: 5372,
            paymentMethod: 'Debit Card'
        },
        {
            _id: '6701234567890abcdef12348',
            status: 'pending',
            createdAt: new Date('2024-09-15'),
            deliveryDate: new Date('2024-09-20'),
            items: [
                {
                    productName: 'Phone Case',
                    quantity: 3,
                    price: 299
                }
            ],
            deliveryAddress: {
                street: '321 Fashion Lane',
                city: 'Pune',
                state: 'Maharashtra'
            },
            subtotal: 897,
            shippingCost: 0,
            discount: 0,
            totalAmount: 897,
            paymentMethod: 'Net Banking'
        }
    ];
};

// Route: Display all orders for logged-in user
router.get('/my-orders', isAuthenticated, (req, res) => {
    try {
        // In a real application, fetch orders from database for req.user._id
        // Example: const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        
        const orders = getOrdersData();
        
        res.render('myOrders', {
            orders: orders,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).render('error', { 
            message: 'Error loading orders',
            error: error 
        });
    }
});

// Route: Get order details
router.get('/order-details/:orderId', isAuthenticated, (req, res) => {
    try {
        const { orderId } = req.params;
        
        // In a real application, fetch from database
        // Example: const order = await Order.findById(orderId);
        
        const orders = getOrdersData();
        const order = orders.find(o => o._id === orderId);
        
        if (!order) {
            return res.status(404).render('error', { 
                message: 'Order not found' 
            });
        }
        
        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ 
            error: 'Error loading order details' 
        });
    }
});

// Route: Track order
router.get('/track-order/:orderId', isAuthenticated, (req, res) => {
    try {
        const { orderId } = req.params;
        
        // In a real application, fetch from database
        const orders = getOrdersData();
        const order = orders.find(o => o._id === orderId);
        
        if (!order) {
            return res.status(404).json({ 
                error: 'Order not found' 
            });
        }
        
        // Return tracking information
        res.json({
            orderId: order._id,
            status: order.status,
            trackingNumber: `TRK-${order._id.substring(0, 8).toUpperCase()}`,
            carrier: 'DHL Express',
            currentLocation: 'Mumbai Distribution Center',
            estimatedDelivery: order.deliveryDate,
            lastUpdate: new Date()
        });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ 
            error: 'Error tracking order' 
        });
    }
});

// Route: Cancel order
router.post('/cancel-order/:orderId', isAuthenticated, (req, res) => {
    try {
        const { orderId } = req.params;
        
        // In a real application, update database
        // Example: await Order.findByIdAndUpdate(orderId, { status: 'cancelled' });
        
        res.json({
            success: true,
            message: 'Order cancelled successfully',
            orderId: orderId
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ 
            error: 'Error cancelling order' 
        });
    }
});

// Route: Write review for order
router.post('/review-order/:orderId', isAuthenticated, (req, res) => {
    try {
        const { orderId } = req.params;
        const { rating, comment, productId } = req.body;
        
        // In a real application, save review to database
        // Example: const review = await Review.create({ orderId, rating, comment, productId });
        
        res.json({
            success: true,
            message: 'Review submitted successfully',
            orderId: orderId
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ 
            error: 'Error submitting review' 
        });
    }
});

// Route: Get order statistics
router.get('/order-stats', isAuthenticated, (req, res) => {
    try {
        // In a real application, calculate from database
        const orders = getOrdersData();
        
        const stats = {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            delivered: orders.filter(o => o.status === 'delivered').length,
            pending: orders.filter(o => o.status === 'pending').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({ 
            error: 'Error fetching statistics' 
        });
    }
});

module.exports = router;
