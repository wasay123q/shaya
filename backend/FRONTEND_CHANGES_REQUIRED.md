# Order Authentication Fix - CRITICAL Frontend Changes Required

## ⚠️ IMPORTANT: Backend Changes Completed

The backend now requires authentication for order operations. You MUST update your frontend code.

---

## 🔧 Required Frontend Changes

### 1. **Update Order Placement API Call**

**Change the `/api/orders/place` endpoint request:**

```javascript
// OLD CODE (Remove this):
const formData = new FormData();
formData.append('userId', userId);  // ❌ Remove this line
formData.append('name', name);
formData.append('mobile', mobile);
formData.append('address', address);
formData.append('payment', payment);
formData.append('items', JSON.stringify(cartItems));

fetch('http://localhost:5000/api/orders/place', {
  method: 'POST',
  body: formData
});

// NEW CODE (Use this):
const token = localStorage.getItem('token');

const formData = new FormData();
// ❌ DO NOT send userId - it comes from the token
formData.append('name', name);
formData.append('mobile', mobile);
formData.append('address', address);
formData.append('payment', payment);
formData.append('items', JSON.stringify(cartItems));

if (paymentProofFile) {
  formData.append('paymentProof', paymentProofFile);
}

const response = await fetch('http://localhost:5000/api/orders/place', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`  // ✅ Add this
  },
  body: formData
});

const data = await response.json();

if (!data.success) {
  alert(data.message);
}
```

---

### 2. **Update Get User Orders API Call**

**Change from `/api/orders/user/${userId}` to `/api/orders/user`:**

```javascript
// OLD CODE (This returns 404):
fetch(`http://localhost:5000/api/orders/user/${userId}`)

// NEW CODE (Use this):
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/orders/user', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  setOrders(data.orders);
}
```

---

### 3. **Handle Authentication Errors**

Add proper error handling for expired or invalid tokens:

```javascript
const handleAuthError = (message) => {
  if (message.includes('Token') || 
      message.includes('expired') || 
      message.includes('authorization') ||
      message.includes('authentication')) {
    
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    alert('Session expired. Please login again.');
    
    // Redirect to login page
    window.location.href = '/login';  // or use your router
  }
};

// Use it like this:
const data = await response.json();
if (!data.success) {
  handleAuthError(data.message);
  alert(data.message);
}
```

---

### 4. **Check Token Before Order Actions**

```javascript
// Before placing order or fetching orders:
const token = localStorage.getItem('token');

if (!token) {
  alert('Please login first');
  window.location.href = '/login';
  return;
}
```

---

## ✅ Backend Routes Summary

| Route | Method | Auth Required | Description |
|-------|--------|---------------|-------------|
| `/api/orders/place` | POST | ✅ Yes | Place new order |
| `/api/orders/user` | GET | ✅ Yes | Get user's orders |
| `/api/orders/all` | GET | ❌ No | Get all orders (Admin) |
| `/api/orders/verify/:id` | PUT | ❌ No | Verify payment (Admin) |
| `/api/orders/reject/:id` | PUT | ❌ No | Reject payment (Admin) |

---

## 🔐 Security Improvements

- ✅ User identity verified via JWT token (cannot be spoofed)
- ✅ Token expiration checked (7 days)
- ✅ userId extracted from token (users can't place orders for others)
- ✅ Proper authentication middleware in place
- ✅ Upload directory fixed to `uploads/payments`

---

## 🐛 Errors Fixed

1. ✅ "User session invalid" error
2. ✅ 404 on `/api/orders/user/undefined`
3. ✅ 500 Internal Server Error on order placement
4. ✅ Missing authentication on order routes
5. ✅ Upload directory mismatch
