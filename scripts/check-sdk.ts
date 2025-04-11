// @ts-ignore
const WeaveDBSDK = require('weavedb-sdk-node');

async function checkSDK() {
  try {
    console.log('Checking WeaveDB SDK...');
    
    // Create an instance
    const sdk = new WeaveDBSDK();
    
    console.log('SDK created successfully');
    
    // Get all methods on the prototype
    const methods = Object.getOwnPropertyNames(WeaveDBSDK.prototype);
    console.log('Available methods:');
    methods.forEach(method => {
      if (typeof sdk[method] === 'function') {
        console.log(`- ${method}`);
      }
    });
    
    // Get all properties on the instance
    console.log('\nInstance properties:');
    const props = Object.getOwnPropertyNames(sdk);
    props.forEach(prop => {
      console.log(`- ${prop}: ${typeof sdk[prop]}`);
    });
    
    return true;
  } catch (error) {
    console.error('Error checking SDK:', error);
    return false;
  }
}

// Run the check
checkSDK().catch(console.error); 