// export interface Credential {
//   credentialId: Uint8Array;
//   publicKey: Uint8Array;
// }

export interface Credential {
  credentialId: any;
  publicKey: any;
}

export interface User {
  id?: string;
  uid?: string;
  phone?: string;
  name?: string;
  email?: string;
  credentials?: any;
}
