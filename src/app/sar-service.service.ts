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
  //fragment encryption
  encodeParams(params: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(params), this.secretKey).toString();
    console.log(encryptedData,'this is the enxrypted text')
    return encryptedData;
  }


  decodeParams(encryptedData: string): any {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedObject = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
    console.log(decryptedObject)
    return decryptedObject;
  }

  
}
