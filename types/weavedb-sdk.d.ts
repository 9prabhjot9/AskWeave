declare module 'weavedb-sdk' {
  class WeaveDB {
    constructor(options?: any);
    deploy(): Promise<string>;
    setDefaultDB(contractTxId: string): Promise<void>;
    addCollection(name: string): Promise<void>;
    setRules(collection: string, rules: any[]): Promise<void>;
    addIndex(collection: string, fields: any[]): Promise<void>;
    initialize(): Promise<void>;
  }
  export = WeaveDB;
}

declare module 'weavedb-sdk-node' {
  import WeaveDB = require('weavedb-sdk');
  class SDKNode extends WeaveDB {
    constructor(options?: any);
    isNode: boolean;
  }
  export = SDKNode;
} 