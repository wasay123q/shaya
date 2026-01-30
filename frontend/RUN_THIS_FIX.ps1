# IMMEDIATE FIX - Run these commands in PowerShell

# Step 1: Go to backend folder
cd d:\shaya-modestwear\backend

# Step 2: Install bcryptjs if not already installed
npm install bcryptjs

# Step 3: Check if authController.js exists and what it returns
Write-Host "Checking backend files..." -ForegroundColor Yellow

# Step 4: The issue is in your authController.js login function
# It's NOT returning user._id properly

# QUICK TEST - Check what your login endpoint returns:
Write-Host "`nTesting login endpoint..." -ForegroundColor Yellow

# You need to manually do this:
# 1. Open: backend/controllers/authController.js
# 2. Find the login function
# 3. Make sure it returns this EXACT structure:

Write-Host @"

YOUR LOGIN FUNCTION MUST RETURN THIS:

res.json({
  success: true,
  message: "Login successful",
  user: {
    _id: user._id,        // ← CRITICAL!
    id: user._id,         // ← Fallback
    name: user.name,
    email: user.email
  },
  userId: user._id        // ← Additional fallback
});

"@ -ForegroundColor Green

Write-Host "`nPress any key after you've updated the backend files..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 5: Restart backend
Write-Host "`nRestarting backend server..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop current server, then run: npm start" -ForegroundColor Cyan
