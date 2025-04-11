const WeaveDBSDK = require('weavedb-sdk');

export async function checkSDK() {
  try {
    console.log('Checking original WeaveDB SDK...');
    
    // Try to create a new instance
    const sdk = new WeaveDBSDK();
    
    console.log('✅ Original WeaveDB SDK is working correctly');
    return true;
  } catch (error) {
    console.error('❌ Error with original WeaveDB SDK:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  checkSDK();
} 