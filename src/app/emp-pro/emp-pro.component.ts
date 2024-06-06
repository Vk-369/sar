import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { SarServiceService } from '../sar-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../common/common.service';



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


constructor(
  private _signupLoginService: SignupLoginService,
  private _sarService: SarServiceService,
  private toastr: ToastrService,
  private http:HttpClient,
  private _commonSer:CommonService

){
  
}
  ngOnInit()
{
  
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
    gender: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
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
      this.profilePic=`data:image/jpeg;base64,${response.data.profilePic}`
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
onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}
saveUpdatedDetails()
{

  if(this.update)
    {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('userID',this.userID);
      formData.append('username',this.updateForm.value.username);
      formData.append('gender',this.updateForm.value.gender);
      formData.append('email',this.updateForm.value.email);
      formData.append('contact',this.updateForm.value.contact);
      //  this._signupLoginService.updateProfile(/formData).subscribe((response) => {
      this.http.post<any>('http://localhost:3000/update/user/profile', formData).subscribe((response:any) => {
        response = this._sarService.decrypt(response.edc);
        if (response.success)
           {
          console.log(response,"this is the response for updating the profile")
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
