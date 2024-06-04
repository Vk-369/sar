import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SarServiceService {

  constructor() { }
  ngOnInit()
  {
    console.log("service gets initialized")
  }
  secretKey: string = 'encrypt-key-vk369';
  
  encodeParams(params: any): string {
    // const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(params), this.secretKey).toString();
    const encryptedData = JSON.stringify(params);

    return encryptedData;
  }

  decodeParams(encryptedData: any): any {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    // const decryptedObject = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
    // const decryptedObject = JSON.parse(encryptedData);
    const decryptedObject = JSON.parse(encryptedData);

    

    return decryptedObject;
  }

    // const decryptedObject = JSON.parse(encryptedData);
    // const encryptedData = JSON.stringify(params);


  encrypt(body: any): string {
    const encryptedData = CryptoJS.AES.encrypt(body, this.secretKey).toString();
    return encryptedData;
  }

  decrypt(response: any): any {
    const decryptedData = CryptoJS.AES.decrypt(response, this.secretKey);
    const decryptedObject = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
    return decryptedObject;
  }

  
}
