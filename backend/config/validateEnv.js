const validateEnv = () => {
  // Core required variables
  const requiredEnvVars = [
    'MONGO_URL',
    'JWT_SECRET',
    'FRONTEND_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  // PORT is only required in local development (not on Vercel serverless)
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (!isServerless) {
    requiredEnvVars.push('PORT');
  }

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Environment validation failed!');
    console.error('Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`  - ${varName}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
};

export default validateEnv;
