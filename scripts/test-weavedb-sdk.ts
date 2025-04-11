// @ts-ignore
const SDK = require('weavedb-sdk-node');

async function testSDK() {
  try {
    console.log('Testing WeaveDB SDK Node...');
    
    // Try to instantiate the SDK
    const sdk = new SDK();
    
    console.log('SDK instantiated successfully!');
    console.log('SDK version:', sdk.version || 'unknown');
    
    // Check some methods to ensure they exist
    const methods = [
      'initialize',
      'deploy',
      'addCollection',
      'setRules',
      'addIndex'
    ];
    
    methods.forEach(method => {
      if (typeof sdk[method] === 'function') {
        console.log(`✅ Method ${method} exists`);
      } else {
        console.log(`❌ Method ${method} is missing or not a function`);
      }
    });
    
    console.log('\nSDK test completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing WeaveDB SDK:', error);
    return false;
  }
}

// Run the test
testSDK().then(result => {
  if (!result) {
    process.exit(1);
  }
}); 