import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  isValidControl(form: FormGroup, control: string): boolean {
    if (!form.invalid) {
      return false
    }
    if (!form.get(control)?.invalid) {
      return false
    }
    if (form.get(control)?.invalid && (form.get(control)?.touched || form.get(control)?.dirty)) {
      return true
    }
    return false
  }

  getErrorMsg(form: FormGroup, control: string, display: string): string {
    if (form.get(control)?.errors) {
      if (form.get(control)?.errors?.['required']) {
        return `${display} is required`
      } else if (form.get(control)?.errors?.['pattern']) {
        return `Enter a valid ${display}`
      } else if (form.get(control)?.errors?.['minlength']) {
        return `${display} should be min ${form.get(control)?.errors?.['minlength'].requiredLength} characters`
      } else if (form.get(control)?.errors?.['maxlength']) {
        return `${display} should be max ${form.get(control)?.errors?.['maxlength'].requiredLength} characters`
      } else if (form.get(control)?.errors?.['email']) {
        return `Enter a Valid ${display}`
      }
    }
    console.log(form.get(control))
    return ''
  }
}
