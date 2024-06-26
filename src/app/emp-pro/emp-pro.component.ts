import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { SarServiceService } from '../sar-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';
import { env } from 'src/assets/env';



@Component({
  selector: 'app-emp-pro',
  templateUrl: './emp-pro.component.html',
  styleUrls: ['./emp-pro.component.css']
})
export class EmpProComponent {
  @Input() userId:string='u_Id_480'
  @Output() closeEmpView=new EventEmitter<boolean>();
  userID:any
  userDetails:any
  update:any=false
  updateForm!: FormGroup;
  openConfirmationModal:any=false
  selectedFile:any;
  songsListShimmer:any=false
  urlPrefix:any



constructor(
  private _signupLoginService: SignupLoginService,
  private _sarService: SarServiceService,
  private toastr: ToastrService,
  private http:HttpClient,
  private _commonSer:CommonService,
  private router: Router,


){
  
}
  ngOnInit()
{
  
  this.urlPrefix = env.apiUrl;

  this.userID = sessionStorage.getItem('userID');
  this.update=false
this.getUserDetails()
this.InitUpdateForm()
}
ngOnChanges(changes: SimpleChanges)
{
console.log(changes)
}
closeEvent()
{
  this.closeEmpView.emit(true)
}

InitUpdateForm() {
  this.updateForm = new FormGroup({
    username: new FormControl('', Validators.required),
    gender: new FormControl({value: '', disabled: true}),
    email: new FormControl({value: '', disabled: true}),
    contact: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });
}
profilePic:any
getUserDetails()
{
  this.songsListShimmer=true
  this._signupLoginService.userDetails({userID:this.userID}).subscribe((response) => {
    response = this._sarService.decrypt(response.edc);
    if (response.success) {
      console.log(
        response,'these are thes user details');
      this.userDetails = response.data.data[0];
      this.profilePic=response.data.profilePic?`data:image/jpeg;base64,${response.data.profilePic}`:
      '../../assets/images/profile/default profile.jpg'
      this.patchFormValue()
  this.songsListShimmer=false

    } else {
  this.songsListShimmer=false

      //!through toaster message
      this.toastr.error('error while fetching userDetails');

    }
  });
}
saveTheData(e?:any)
{
  this.saveUpdatedDetails()
}
previewImage:any
onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.previewImage = reader.result as string; // Store base64 data for preview
  };

  reader.readAsDataURL(event.target.files[0]);

}


logout()
{
  this.router.navigate(['/'])
}
saveUpdatedDetails()
{

  console.log(this.updateForm,'this is the form for updation')
  if(this.update)
    {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('userID',this.userID);
      formData.append('username',this.updateForm.controls?.['username'].value);
      formData.append('gender',this.updateForm.controls?.['gender'].value);
      formData.append('email',this.updateForm.controls?.['email'].value);
      formData.append('contact',this.updateForm.controls?.['contact'].value);
      //  this._signupLoginService.updateProfile(/formData).subscribe((response) => {
      this.http.post<any>(`${this.urlPrefix}/update/user/profile`, formData).subscribe((response:any) => {
        response = this._sarService.decrypt(response.edc);
        if (response.success)
           {
          console.log(response,"this is the response for updating the profile")
          //after updating the data again hit the api for getting the update values of the profile
          this.getUserDetails()
          this.update=false
   } else {
          //!through toaster message
          this.toastr.error('error while updating the user data');
        }
      });
    }
}
openModal()
{
  if(this.update)
  this.openConfirmationModal=true
this._commonSer.modalToggle('updateOrofileModel','show')
}
patchFormValue()
{
  this.updateForm.patchValue({
    username:this.userDetails.username,
    gender:this.userDetails.gender,
    email:this.userDetails.mail_id,
    contact:this.userDetails.phone_no,
    status:this.userDetails.status ? 'Active' : 'Inactive'
  })
}




}
