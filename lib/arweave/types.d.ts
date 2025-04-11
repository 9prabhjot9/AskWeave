declare type PermissionType = 
  | 'ACCESS_ADDRESS'
  | 'ACCESS_PUBLIC_KEY'
  | 'ACCESS_ALL_ADDRESSES'
  | 'SIGN_TRANSACTION'
  | 'ENCRYPT'
  | 'DECRYPT'
  | 'SIGNATURE'
  | 'ACCESS_ARWEAVE_CONFIG'
  | 'DISPATCH';

declare interface AppInfo {
  name?: string;
  logo?: string;
}

declare interface GatewayConfig {
  host: string;
  port: number;
  protocol: string;
}

declare interface Transaction {
  id?: string;
  owner?: string;
  tags?: { name: string; value: string }[];
  target?: string;
  quantity?: string;
  data?: string;
  reward?: string;
  signature?: string;
  data_root?: string;
  data_size?: string;
}

declare interface ArweaveWallet {
  walletName: string;
  connect(permissions: PermissionType[], appInfo?: AppInfo, gateway?: GatewayConfig): Promise<void>;
  disconnect(): Promise<void>;
  getActiveAddress(): Promise<string>;
  getAllAddresses(): Promise<string[]>;
  getActivePublicKey(): Promise<string>;
  getArweaveConfig(): Promise<GatewayConfig>;
  signature(data: Uint8Array, options?: Algorithm): Promise<Uint8Array>;
  sign(transaction: Transaction): Promise<Transaction>;
  encrypt(data: string | Uint8Array, options?: { algorithm: string }): Promise<Uint8Array>;
  decrypt(data: string | Uint8Array, options?: { algorithm: string }): Promise<Uint8Array>;
  dispatch(transaction: Transaction): Promise<void>;
}

declare interface WandersWallet {
  connect(permissions: PermissionType[]): Promise<void>;
  disconnect(): Promise<void>;
  getActiveAddress(): Promise<string>;
  signature(data: any): Promise<string>;
}

declare global {
  interface Window {
    arweaveWallet: ArweaveWallet;
    wanders: {
      connect(): Promise<void>;
      disconnect(): Promise<void>;
      getActiveAddress(): Promise<string>;
      getAllAddresses(): Promise<string[]>;
      getActivePublicKey(): Promise<string>;
      getArweaveConfig(): Promise<GatewayConfig>;
      signature(data: Uint8Array, options?: Algorithm): Promise<Uint8Array>;
      sign(transaction: Transaction): Promise<Transaction>;
      encrypt(data: string | Uint8Array, options?: { algorithm: string }): Promise<Uint8Array>;
      decrypt(data: string | Uint8Array, options?: { algorithm: string }): Promise<Uint8Array>;
      dispatch(transaction: Transaction): Promise<void>;
    };
  }
} 