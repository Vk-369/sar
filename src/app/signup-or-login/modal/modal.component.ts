import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SarServiceService } from 'src/app/sar-service.service';
declare var $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() modalBody: string = 'Into the modal';
  @Input() showConfirmButton: boolean = true;
  @Input() openModalCondition: boolean = false;
  @Input() showClose: boolean = true;
  @Input() inputNeeded: boolean = false;
  @Input() radioButtonsNeeded: boolean = false;
  @Input() confirmContent: string = 'Save changes';
  @Input() modalTitle: string = 'this is the modal';
  @Input() userId: string = 'vk369';
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() confirmModal = new EventEmitter<any>();
  inputFieldForm!: FormGroup;
constructor( 
  private _sarService: SarServiceService,
  private router: Router
)
{}
  ngOnInit() {
    console.log('modal has been initialized bro');
    this.inputFieldForm = new FormGroup({
      inputData: new FormControl('', Validators.required),
      radioValue: new FormControl(''),
    });


  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log(this.modalBody, this.openModalCondition);
    this.openModalCondition
      ? this.modalToggle('show')
      : this.modalToggle('hide');
  }

  modalToggle(item?: any) {
    $('#exampleModalCenter').modal(item);
  }
  closeEvent() {
   this.resetModel()
    console.log('emit');
    this.closeModal.emit(true);
  }

  resetModel()
  {
    this.inputNeeded=false
    this.radioButtonsNeeded=true
    this.modalTitle='which one are you'
    this.inputFieldForm.reset()
    $('#exampleModalCenter').modal('hide');
  }
  copyToClipBoard()
{
  navigator.clipboard.writeText(this.userId).then(
()=>
  {
    console.log("copied to the clipboard")
  }),
  (err:any)=>
    {
      console.log('error while copying the data')
    }
}
  confirmEvent(item?: any) {
    if (!item) {
      this.confirmModal.emit(true);
    }
   if(item==='navigateToMusic')
    {
      this.router.navigate(['/musicPlayer']);
      this.confirmModal.emit({
        eventAcknowledgement: true,
        asHost:true
      });


    }
    else if (item == 'withInput') {
      if(this.guest)
        {
          const connect=this._sarService.encodeParams({code:this.inputFieldForm.value.inputData,guest:true,host:false})
      this.router.navigate(['/musicPlayer'], {fragment:connect});
        }
      this.confirmModal.emit({
        eventAcknowledgement: true,
        inputFieldValue: this.inputFieldForm.value.inputData,
        asHost:false

      });

    } else if (item == 'withRadio') {
      this.confirmModal.emit({
        eventAcknowledgement: true,
        radioButtonVal: this.inputFieldForm.value.radioValue,
      });
    }
    this.resetModel()
  }
  guest: any;
 host:any
  connectedAsHost()
  {
    console.log("intot he host function")
    this.guest = false;
    this.host=true
    this.inputNeeded = false;
    this.radioButtonsNeeded = false;
    this.modalTitle = 'Share this code with your friend';
    this.modalBody=this.userId
    // const connect=this._sarService.encodeParams({guest:false,host:true})
    // this.router.navigate(['/connect'], {fragment:connect});
  }
  connectedAsGuest()
  {
    console.log('into the validate function');
      this.guest = true;
      this.host=false
      this.inputNeeded = true;
      this.radioButtonsNeeded = false;
      this.modalTitle = 'Enter Code';
      // const connect=this._sarService.encodeParams({guest:true,host:false})
      // this.router.navigate(['/connect'], {fragment:connect});
  }
}
