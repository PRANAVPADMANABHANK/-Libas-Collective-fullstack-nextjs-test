"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmailManual = exports.getTrendingProducts = exports.updateProductPopularity = exports.searchProducts = exports.processOrder = exports.getAnalytics = exports.cleanupUserData = exports.updateProductViews = exports.getProductRecommendations = exports.sendWelcomeEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const identity_1 = require("firebase-functions/v2/identity");
const admin = require("firebase-admin");
const resend_1 = require("resend");
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
// Send welcome email when user signs up
exports.sendWelcomeEmail = (0, identity_1.beforeUserCreated)(async (event) => {
    console.log('=== sendWelcomeEmail function triggered ===');
    console.log('Event data:', JSON.stringify(event.data, null, 2));
    const user = event.data;
    if (!user) {
        console.log('No user data found, returning early');
        return;
    }
    console.log(`Processing user: ${user.uid}`);
    console.log(`User email: ${user.email}`);
    console.log(`User display name: ${user.displayName}`);
    try {
        // Store user metadata first
        console.log('Storing user metadata in Firestore...');
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            displayName: user.displayName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastLogin: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('User metadata stored successfully');
        // Send welcome email using Resend
        console.log('Checking Resend API key...');
        const resendApiKey = process.env.RESEND_API_KEY;
        console.log('RESEND_API_KEY exists:', !!resendApiKey);
        console.log('RESEND_API_KEY length:', resendApiKey ? resendApiKey.length : 0);
        console.log('RESEND_API_KEY first 10 chars:', resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'undefined');
        if (resendApiKey) {
            console.log('Initializing Resend client...');
            const resend = new resend_1.Resend(resendApiKey);
            const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
            console.log('From email:', fromEmail);
            console.log('To email:', user.email);
            const emailData = {
                from: fromEmail,
                to: user.email,
                subject: 'Welcome to ShopHub! 🎉',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb; text-align: center;">Welcome to ShopHub!</h1>
            <p>Hi ${user.displayName || 'there'},</p>
            <p>Thank you for creating an account with ShopHub! We're excited to have you on board.</p>
            <p>Here's what you can do with your new account:</p>
            <ul>
              <li>Browse our extensive product catalog</li>
              <li>Add items to your favorites</li>
              <li>Shop with our secure cart system</li>
              <li>Track your orders</li>
            </ul>
            <p>Start shopping now by visiting our website!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Shopping
              </a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The ShopHub Team</p>
          </div>
        `
            };
            console.log('Email data prepared:', {
                from: emailData.from,
                to: emailData.to,
                subject: emailData.subject,
                htmlLength: emailData.html.length
            });
            try {
                console.log('Attempting to send email with Resend...');
                const result = await resend.emails.send(emailData);
                console.log('Resend API response:', JSON.stringify(result, null, 2));
                console.log(`Welcome email sent successfully to: ${user.email}`);
            }
            catch (emailError) {
                console.error('=== RESEND EMAIL ERROR ===');
                console.error('Error sending email with Resend:', emailError);
                console.error('Error message:', emailError.message);
                console.error('Error stack:', emailError.stack);
                if (emailError.response) {
                    console.error('Error response:', JSON.stringify(emailError.response, null, 2));
                }
                console.error('=== END RESEND EMAIL ERROR ===');
            }
        }
        else {
            console.log('Resend API key not configured, skipping email send');
            console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('RESEND')));
        }
    }
    catch (error) {
        console.error('=== GENERAL FUNCTION ERROR ===');
        console.error('Error in sendWelcomeEmail:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== END GENERAL FUNCTION ERROR ===');
        // Don't throw error to prevent user creation from failing
    }
    console.log('=== sendWelcomeEmail function completed ===');
});
// Get product recommendations based on user preferences
exports.getProductRecommendations = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { userId, category, limit = 5 } = req.body;
        let query = db.collection('products').where('inStock', '==', true);
        if (category) {
            query = query.where('category', '==', category);
        }
        // Log the request parameters for debugging
        console.log('Product recommendations request:', { userId, category, limit });
        const snapshot = await query.limit(limit).get();
        const products = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json({ success: true, products });
    }
    catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ success: false, error: 'Failed to get recommendations' });
    }
});
// Update product view count
exports.updateProductViews = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            res.status(400).json({ success: false, error: 'Product ID required' });
            return;
        }
        const productRef = db.collection('products').doc(productId);
        await productRef.update({
            viewCount: admin.firestore.FieldValue.increment(1),
            lastViewed: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error updating product views:', error);
        res.status(500).json({ success: false, error: 'Failed to update views' });
    }
});
// Cleanup user data when account is deleted (using Firestore trigger instead)
exports.cleanupUserData = (0, firestore_1.onDocumentDeleted)('users/{userId}', async (event) => {
    const userId = event.params.userId;
    try {
        // Remove user favorites
        const favoritesSnapshot = await db.collection('favorites')
            .where('userId', '==', userId)
            .get();
        const batch = db.batch();
        favoritesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Cleaned up data for user: ${userId}`);
    }
    catch (error) {
        console.error('Error cleaning up user data:', error);
    }
});
// Get analytics data
exports.getAnalytics = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const productsRef = db.collection('products');
        let snapshot;
        if (startDate && endDate) {
            snapshot = await productsRef
                .where('createdAt', '>=', new Date(startDate))
                .where('createdAt', '<=', new Date(endDate))
                .get();
        }
        else {
            snapshot = await productsRef.get();
        }
        const products = snapshot.docs.map(doc => doc.data());
        const analytics = {
            totalProducts: products.length,
            categories: products.reduce((acc, product) => {
                acc[product.category] = (acc[product.category] || 0) + 1;
                return acc;
            }, {}),
            averagePrice: products.reduce((sum, product) => sum + product.price, 0) / products.length,
            inStockCount: products.filter((p) => p.inStock).length
        };
        res.json({ success: true, analytics });
    }
    catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({ success: false, error: 'Failed to get analytics' });
    }
});
// Process order when cart is submitted
exports.processOrder = (0, https_1.onRequest)(async (req, res) => {
    var _a;
    try {
        const { userId, items, total, shippingAddress } = req.body;
        if (!userId || !items || !total) {
            res.status(400).json({ success: false, error: 'Missing required order data' });
            return;
        }
        // Create order document
        const orderRef = await db.collection('orders').add({
            userId,
            items,
            total,
            shippingAddress,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Update product inventory
        const batch = db.batch();
        for (const item of items) {
            const productRef = db.collection('products').doc(item.productId);
            const productDoc = await productRef.get();
            const currentStock = ((_a = productDoc.data()) === null || _a === void 0 ? void 0 : _a.stockQuantity) || 0;
            const newStock = currentStock - item.quantity;
            batch.update(productRef, {
                stockQuantity: newStock,
                inStock: newStock > 0
            });
        }
        await batch.commit();
        res.json({
            success: true,
            orderId: orderRef.id,
            message: 'Order processed successfully'
        });
    }
    catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ success: false, error: 'Failed to process order' });
    }
});
// Search products with advanced filtering
exports.searchProducts = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice, sortBy = 'name', sortOrder = 'asc' } = req.query;
        let productsRef = db.collection('products').where('inStock', '==', true);
        // Apply category filter
        if (category && category !== 'all') {
            productsRef = productsRef.where('category', '==', category);
        }
        // Apply price filters
        if (minPrice) {
            productsRef = productsRef.where('price', '>=', parseFloat(minPrice));
        }
        if (maxPrice) {
            productsRef = productsRef.where('price', '<=', parseFloat(maxPrice));
        }
        const snapshot = await productsRef.get();
        let products = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // Apply text search if query provided
        if (query) {
            const searchTerm = query.toLowerCase();
            products = products.filter(product => {
                var _a, _b, _c;
                return ((_a = product.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm)) ||
                    ((_b = product.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTerm)) ||
                    ((_c = product.category) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchTerm));
            });
        }
        // Apply sorting
        products.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (sortOrder === 'desc') {
                return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
        });
        res.json({ success: true, products, total: products.length });
    }
    catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ success: false, error: 'Failed to search products' });
    }
});
// Update product popularity score based on views and interactions
exports.updateProductPopularity = (0, firestore_1.onDocumentUpdated)('products/{productId}', async (event) => {
    var _a, _b, _c;
    try {
        const productId = event.params.productId;
        console.log(`Updating popularity for product: ${productId}`);
        const newData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after.data();
        const oldData = (_b = event.data) === null || _b === void 0 ? void 0 : _b.before.data();
        if (!newData || !oldData)
            return;
        // Calculate popularity score based on views, favorites, and sales
        const popularityScore = ((newData.viewCount || 0) * 0.3 +
            (newData.favoriteCount || 0) * 0.4 +
            (newData.salesCount || 0) * 0.3);
        // Only update if popularity score changed significantly
        if (Math.abs(popularityScore - (oldData.popularityScore || 0)) > 0.1) {
            await ((_c = event.data) === null || _c === void 0 ? void 0 : _c.after.ref.update({
                popularityScore: Math.round(popularityScore * 100) / 100,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }));
        }
    }
    catch (error) {
        console.error('Error updating product popularity:', error);
    }
});
// Get trending products based on popularity
exports.getTrendingProducts = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const snapshot = await db.collection('products')
            .where('inStock', '==', true)
            .orderBy('popularityScore', 'desc')
            .limit(parseInt(limit))
            .get();
        const products = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json({ success: true, products });
    }
    catch (error) {
        console.error('Error getting trending products:', error);
        res.status(500).json({ success: false, error: 'Failed to get trending products' });
    }
});
// Manually send welcome email (for testing or resending)
exports.sendWelcomeEmailManual = (0, https_1.onRequest)(async (req, res) => {
    console.log('=== sendWelcomeEmailManual function triggered ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    try {
        const { email, displayName } = req.body;
        if (!email) {
            console.log('Email is missing from request body');
            res.status(400).json({ success: false, error: 'Email is required' });
            return;
        }
        console.log(`Processing manual email send to: ${email}`);
        console.log(`Display name: ${displayName || 'not provided'}`);
        const resendApiKey = process.env.RESEND_API_KEY;
        console.log('RESEND_API_KEY exists:', !!resendApiKey);
        console.log('RESEND_API_KEY length:', resendApiKey ? resendApiKey.length : 0);
        console.log('RESEND_API_KEY first 10 chars:', resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'undefined');
        if (!resendApiKey) {
            console.log('Resend API key not configured');
            res.status(500).json({ success: false, error: 'Resend API key not configured' });
            return;
        }
        console.log('Initializing Resend client...');
        const resend = new resend_1.Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        console.log('From email:', fromEmail);
        console.log('To email:', email);
        const emailData = {
            from: fromEmail,
            to: email,
            subject: 'Welcome to ShopHub! 🎉',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">Welcome to ShopHub!</h1>
          <p>Hi ${displayName || 'there'},</p>
          <p>Thank you for creating an account with ShopHub! We're excited to have you on board.</p>
          <p>Here's what you can do with your new account:</p>
          <ul>
            <li>Browse our extensive product catalog</li>
            <li>Add items to your favorites</li>
            <li>Shop with our secure cart system</li>
            <li>Track your orders</li>
          </ul>
          <p>Start shopping now by visiting our website!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Shopping
            </a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The ShopHub Team</p>
        </div>
      `
        };
        console.log('Email data prepared:', {
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            htmlLength: emailData.html.length
        });
        try {
            console.log('Attempting to send email with Resend...');
            const result = await resend.emails.send(emailData);
            console.log('Resend API response:', JSON.stringify(result, null, 2));
            console.log(`Manual welcome email sent successfully to: ${email}`);
            res.json({ success: true, message: 'Welcome email sent successfully' });
        }
        catch (emailError) {
            console.error('=== RESEND EMAIL ERROR ===');
            console.error('Error sending email with Resend:', emailError);
            console.error('Error message:', emailError.message);
            console.error('Error stack:', emailError.stack);
            if (emailError.response) {
                console.error('Error response:', JSON.stringify(emailError.response, null, 2));
            }
            console.error('=== END RESEND EMAIL ERROR ===');
            res.status(500).json({ success: false, error: 'Failed to send email' });
        }
    }
    catch (error) {
        console.error('=== GENERAL FUNCTION ERROR ===');
        console.error('Error in sendWelcomeEmailManual:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== END GENERAL FUNCTION ERROR ===');
        res.status(500).json({ success: false, error: 'Failed to send welcome email' });
    }
    console.log('=== sendWelcomeEmailManual function completed ===');
});
//# sourceMappingURL=index.js.map