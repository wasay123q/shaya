const validateEnv = () => {
  const requiredEnvVars = [
    'MONGO_URL',
    'JWT_SECRET',
    'PORT',
    'FRONTEND_URL'
  ];

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
