# Cloudinary Setup Guide

## What Changed?
Your file uploads now use **Cloudinary** (cloud storage) instead of local disk storage. This is required for Vercel's serverless environment.

## Setup Steps

### 1. Create a Free Cloudinary Account
1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email (it's completely free!)
3. Verify your email

### 2. Get Your Credentials
After logging in to Cloudinary:
1. Go to your Dashboard (https://console.cloudinary.com/)
2. You'll see your credentials at the top:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Add Credentials to Vercel
1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:
   ```
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = your_api_key
   CLOUDINARY_API_SECRET = your_api_secret
   ```
5. Click **Save**

### 4. Add Credentials Locally (for testing)
Create a `.env` file in your `backend/` folder (if it doesn't exist):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**⚠️ Important:** Never commit the `.env` file to Git!

## What's Stored on Cloudinary?
- **Product Images**: Stored in `shaya/products/` folder
- **Payment Proofs**: Stored in `shaya/payments/` folder
- **Other Uploads**: Stored in `shaya/uploads/` folder

## File Access
When a file is uploaded, Cloudinary returns a URL like:
```
https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/shaya/products/product-abc123.jpg
```

This URL is saved to your MongoDB database and can be accessed from anywhere (perfect for your frontend!).

## Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month

This is more than enough for most small to medium projects!

## Testing
After setup, test by:
1. Adding a new product with an image
2. Placing an order with a payment proof
3. Check your Cloudinary dashboard to see the uploaded files

## Questions?
- Cloudinary Docs: https://cloudinary.com/documentation
- Dashboard: https://console.cloudinary.com/
