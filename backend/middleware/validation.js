// Input validation and sanitization middleware

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || typeof name !== 'string') {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  } else if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  // Sanitize inputs
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push("Email is required");
  }

  if (!password || typeof password !== 'string') {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  // Sanitize email
  req.body.email = email.trim().toLowerCase();

  next();
};

export const validateOrder = (req, res, next) => {
  const { name, mobile, address, payment } = req.body;
  const errors = [];

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push("Valid name is required");
  }

  // Mobile validation
  if (!mobile || typeof mobile !== 'string') {
    errors.push("Mobile number is required");
  } else if (!/^[0-9]{11}$/.test(mobile.trim())) {
    errors.push("Mobile number must be 11 digits");
  }

  // Address validation
  if (!address || typeof address !== 'string' || address.trim().length < 10) {
    errors.push("Valid address is required (minimum 10 characters)");
  }

  // Payment method validation
  const validPaymentMethods = ["Cash on Delivery", "JazzCash", "Bank Transfer"];
  if (!payment || !validPaymentMethods.includes(payment)) {
    errors.push("Invalid payment method");
  }

  // Items validation
  if (!req.body.items) {
    errors.push("Order items are required");
  } else {
    try {
      const items = typeof req.body.items === 'string' 
        ? JSON.parse(req.body.items) 
        : req.body.items;
      
      if (!Array.isArray(items) || items.length === 0) {
        errors.push("Order must contain at least one item");
      }
    } catch (err) {
      errors.push("Invalid items format");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  // Sanitize inputs
  req.body.name = name.trim();
  req.body.mobile = mobile.trim();
  req.body.address = address.trim();

  next();
};

export const validateProduct = (req, res, next) => {
  const { name, category, price, stock } = req.body;
  const errors = [];

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push("Product name is required (minimum 3 characters)");
  }

  // Category validation
  if (!category || typeof category !== 'string' || category.trim().length < 2) {
    errors.push("Category is required");
  }

  // Price validation
  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum < 0) {
    errors.push("Valid price is required (must be non-negative)");
  }

  // Stock validation
  if (stock !== undefined) {
    const stockNum = Number(stock);
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      errors.push("Stock must be a non-negative integer");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  // Sanitize inputs
  req.body.name = name.trim();
  req.body.category = category.trim();
  req.body.price = priceNum;
  if (stock !== undefined) {
    req.body.stock = Number(stock);
  }

  next();
};
