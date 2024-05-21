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
    console.log('emit');
    this.closeModal.emit(true);
  }

  confirmEvent(item?: any) {
    if (!item) this.confirmModal.emit(true);
    else if (item == 'withInput') {
      if(this.guest)
        {
          const connect=this._sarService.encodeParams({code:this.inputFieldForm.value.inputData,guest:true})
      this.router.navigate(['/connect'], {fragment:connect});
        }
      this.confirmModal.emit({
        eventAcknowledgement: true,
        inputFieldValue: this.inputFieldForm.value.inputData,
      });

    } else if (item == 'withRadio') {
      this.confirmModal.emit({
        eventAcknowledgement: true,
        radioButtonVal: this.inputFieldForm.value.radioValue,
      });
    }
  }
  guest: any;
  validate(item:any) {
    if(item)
   { //this is to validate whether the user is a guest or guest
      console.log('into the validate function');
      this.guest = true;
      this.inputNeeded = true;
      this.radioButtonsNeeded = false;
      this.modalTitle = 'Enter Code';
      
    }
    else{
      this.guest = false;
      this.inputNeeded = false;
      this.radioButtonsNeeded = true;
      this.modalTitle = 'Enter input';
          const connect=this._sarService.encodeParams({guest:false})
          this.router.navigate(['/connect'], {fragment:connect});

    }
  }
}
