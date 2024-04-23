import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, throwError, of, catchError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { SarServiceService } from '../sar-service.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private _http: HttpClient,
    private _sarService: SarServiceService
  ) {}

  isValidControl(form: FormGroup, control: string): boolean {
    if (!form.invalid) {
      return false;
    }
    if (!form.get(control)?.invalid) {
      return false;
    }
    if (
      form.get(control)?.invalid &&
      (form.get(control)?.touched || form.get(control)?.dirty)
    ) {
      return true;
    }
    return false;
  }

  getErrorMsg(form: FormGroup, control: string, display: string): string {
    if (form.get(control)?.errors) {
      if (form.get(control)?.errors?.['required']) {
        return `${display} is required`;
      } else if (form.get(control)?.errors?.['pattern']) {
        return `Enter a valid ${display}`;
      } else if (form.get(control)?.errors?.['minlength']) {
        return `${display} should be min ${
          form.get(control)?.errors?.['minlength'].requiredLength
        } characters`;
      } else if (form.get(control)?.errors?.['maxlength']) {
        return `${display} should be max ${
          form.get(control)?.errors?.['maxlength'].requiredLength
        } characters`;
      } else if (form.get(control)?.errors?.['email']) {
        return `Enter a Valid ${display}`;
      }
    }
    console.log(form.get(control));
    return '';
  }

  callApi({
    url,
    method,
    body = null,
  }: {
    url: string;
    method: string;
    body?: any;
  }): Observable<any> {
    switch (method.toUpperCase())
     {
      case 'LOGIN':
        console.log(url, {edc: this._sarService.encrypt(JSON.stringify(body))})
        return this._http.post(url, {edc: this._sarService.encrypt(JSON.stringify(body))})
      
      case 'GET':
      return this._http.get(url)

      case 'POST':
        console.log(url, {edc: this._sarService.encrypt(JSON.stringify(body))})
        return this._http.post(url, {edc: this._sarService.encrypt(JSON.stringify(body))})
          .pipe(
            catchError((error) => {
              console.log(error);
              
              return of(false);
            })
          );
        break;
    }
      
    return new Observable((observer) => observer.error(new Error('false')));
  }
}
