import { Injectable } from '@angular/core';
import { environment } from 'src/env';
import { HttpClient } from '@angular/common/http';
import {endPoints} from './settings'

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  baseUrl:any=environment.apiUrl
  constructor(private http:HttpClient) { }

  apiCall(method:any,urlLink?:any,body?:any)
  {
    const url = `${this.baseUrl}${urlLink}`;
    switch(method)
    {
      case 'GET' :
        return this.http.get(url)
      case 'POST':
        return this.http.post(url, body);
      case 'PUT':
        return this.http.put(url, body);
      case 'DELETE':
        return this.http.delete(url);
    }
    
  }
}
