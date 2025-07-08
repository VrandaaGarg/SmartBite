# SmartBite Appwrite Integration Setup

This document provides instructions for setting up Appwrite integration with the SmartBite application.

## Prerequisites

1. An Appwrite account (sign up at https://appwrite.io)
2. Node.js and npm installed
3. The SmartBite frontend application

## Appwrite Setup

### 1. Create a New Project

1. Log in to your Appwrite console
2. Create a new project
3. Note down your Project ID

### 2. Create Database and Collections

Create a database and the following collections with these schemas:

#### Users Collection (`smartbite_user`)
- `userId` (String, Required) - Appwrite auth user ID
- `name` (String, Required) - User's full name
- `email` (String, Required) - User's email address
- `phone` (String, Required) - User's phone number
- `houseNo` (String, Optional) - House number
- `street` (String, Optional) - Street address
- `landmark` (String, Optional) - Landmark
- `city` (String, Optional) - City
- `state` (String, Optional) - State
- `pincode` (Integer, Optional) - PIN code
- `isAdmin` (Boolean, Required, Default: false) - Admin status
- `createdAt` (String, Required) - Creation timestamp

#### Dishes Collection
- `name` (String, Required) - Dish name
- `description` (String, Required) - Dish description
- `price` (Float, Required) - Dish price
- `imgUrl` (String, Required) - Image URL
- `menuId` (String, Required) - Menu category ID
- `type` (String, Required) - "veg" or "nonVeg"
- `isAvailable` (Boolean, Required, Default: true) - Availability status

#### Menus Collection
- `name` (String, Required) - Menu category name
- `description` (String, Optional) - Menu description
- `icon` (String, Optional) - Icon class/URL

#### Orders Collection
- `userId` (String, Required) - User ID who placed the order
- `items` (String, Required) - JSON string of order items
- `totalAmount` (Float, Required) - Total order amount
- `paymentMethod` (String, Required) - Payment method
- `customerName` (String, Required) - Customer name
- `customerEmail` (String, Required) - Customer email
- `customerPhone` (String, Required) - Customer phone
- `deliveryAddress` (String, Required) - Delivery address
- `status` (String, Required, Default: "Pending") - Order status
- `orderedOn` (String, Required) - Order timestamp

#### Carts Collection
- `userId` (String, Required) - User ID
- `dishId` (String, Required) - Dish ID
- `quantity` (Integer, Required) - Quantity
- `name` (String, Required) - Dish name
- `imgUrl` (String, Required) - Dish image URL
- `price` (Float, Required) - Dish price

#### Reviews Collection
- `userId` (String, Required) - User ID who wrote the review
- `dishId` (String, Required) - Dish ID being reviewed
- `rating` (Integer, Required) - Rating (1-5)
- `comment` (String, Required) - Review comment
- `createdAt` (String, Required) - Review timestamp

### 3. Set Permissions

For each collection, set appropriate permissions:
- **Read**: Any authenticated user
- **Create**: Any authenticated user
- **Update**: Document owner or admin users
- **Delete**: Document owner or admin users

### 4. Create Storage Bucket (Optional)

If you plan to upload images:
1. Create a storage bucket
2. Set appropriate permissions
3. Note the bucket ID

## Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in your Appwrite configuration:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_DISHES_COLLECTION_ID=your_dishes_collection_id
VITE_APPWRITE_MENUS_COLLECTION_ID=your_menus_collection_id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id
VITE_APPWRITE_CARTS_COLLECTION_ID=your_carts_collection_id
VITE_APPWRITE_REVIEWS_COLLECTION_ID=your_reviews_collection_id
VITE_APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id
```

## Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and run:
   ```javascript
   testAppwriteIntegration()
   ```

3. Test authentication:
   ```javascript
   testAuthFlow('your-email@example.com', 'your-password')
   ```

## Data Migration

If you have existing data, you'll need to migrate it to Appwrite:

1. Export your existing data
2. Use Appwrite's REST API or SDKs to import the data
3. Ensure data formats match the collection schemas

## Features Implemented

✅ User authentication (signup, login, logout)
✅ Menu and dish management
✅ Shopping cart functionality
✅ Order management
✅ Review system
✅ Admin panel integration
✅ Real-time data synchronization

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is added to Appwrite's platform settings
2. **Permission Denied**: Check collection permissions
3. **Environment Variables**: Ensure all required variables are set
4. **Collection IDs**: Verify collection IDs match your Appwrite setup

### Debug Mode

Enable debug mode by adding to your `.env`:
```env
VITE_DEBUG=true
```

This will log additional information to the console.

## Support

For issues related to:
- Appwrite setup: Check Appwrite documentation
- SmartBite integration: Review the code comments and error logs
- General questions: Check the project README
