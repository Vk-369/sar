import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { SarServiceService } from '../sar-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



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
  selectedFile:File |null=null;
  songsListShimmer:any=false


constructor(
  private _signupLoginService: SignupLoginService,
  private _sarService: SarServiceService,
  private toastr: ToastrService

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
getUserDetails()
{
  this.songsListShimmer=true
  this._signupLoginService.userDetails({userID:this.userID}).subscribe((response) => {
    response = this._sarService.decrypt(response.edc);
    if (response.success) {
      console.log(
        response,'these are thes user details');
      this.userDetails = response.data[0];
      this.patchFormValue()
  this.songsListShimmer=false

    } else {
  this.songsListShimmer=false

      //!through toaster message
      this.toastr.error('error while fetching userDetails');

    }
  });
}
fromModal(e:any)
{
  if(e)
  this.saveUpdatedDetails()
}
onFileSelected(e:any)
{
  this.selectedFile = e.target.files[0] as File;
  console.log(this.selectedFile,'this is the file selected')
}
saveUpdatedDetails()
{

  if(this.update)
    {
      // const formData = new FormData();
      // if(this.selectedFile)
      //   {
      //     console.log('this is the into the selected file if condition')
      //     formData.append('profilePic', this.selectedFile);
      //     console.log(this.selectedFile,'the modified file')
      //   }
      // console.log(this.updateForm.value,'this is the form value for body')
      this._signupLoginService.updateProfile({userID:this.userID,userupdatedData:this.updateForm.value}).subscribe((response) => {
        response = this._sarService.decrypt(response.edc);
        if (response.success)
           {
          console.log(response,"this is the esponse for updating the profile")
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
