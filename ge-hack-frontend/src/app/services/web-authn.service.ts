import { Injectable } from '@angular/core';
import { User } from '../interfaces/userFire';
import { ServerMockService } from './server-mock.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class WebAuthnService {
  constructor(private serverMockService: ServerMockService) {}

  webAuthnSignup(user: User): Promise<any> {
    console.log('[webAuthnSignup]');
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      // Challenge shoulda come from the server
      challenge: this.serverMockService.getChallenge(),
      rp: {
        name: 'WebAuthn Test',
        // id: 'localhost:4200',
      },
      user: {
        // Some user id coming from the server
        id: Uint8Array.from(user.uid, (c) => c.charCodeAt(0)),
        name: user.email,
        displayName: user.email,
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        // requireResidentKey: true,
      },
      timeout: 60000,
      attestation: 'direct',
    };

    return navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });
  }

  webAuthnSignin(user: User): Promise<any> {
    console.log('hi' + user.credentials);
    const allowCredentials: PublicKeyCredentialDescriptor[] = user.credentials.map(
      (c) => {
        console.log(c.credentialId);
        return {
          type: 'public-key',
          id: Uint8Array.from(Object.values(c.credentialId)),
        };
      }
    );

    console.log('allowCredentials', allowCredentials);

    const credentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: this.serverMockService.getChallenge(),
      allowCredentials,
    };

    return navigator.credentials.get({
      publicKey: credentialRequestOptions,
    });
  }
}
