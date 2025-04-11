// @ts-ignore
const WeaveDBSDK = require('weavedb-sdk');

async function checkSDK() {
  try {
    console.log('Checking original WeaveDB SDK...');
    
    // Create an instance
    const sdk = new WeaveDBSDK();
    
    console.log('Original SDK created successfully');
    
    // Log the SDK itself
    console.log('SDK type:', typeof WeaveDBSDK);
    console.log('SDK keys:', Object.keys(WeaveDBSDK));
    
    // Check if deploy method exists
    console.log('deploy method exists:', typeof sdk.deploy === 'function');
    
    // Check all available methods
    const methods = [
      'deploy',
      'setDefaultDB',
      'addCollection',
      'setRules',
      'addIndex'
    ];
    
    methods.forEach(method => {
      console.log(`- ${method}: ${typeof sdk[method]}`);
    });
    
    return true;
  } catch (error) {
    console.error('Error checking original SDK:', error);
    return false;
  }
}

// Run the check
checkSDK().catch(console.error); 