import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent {
  @Input() modalBody: string = 'Into the modal';
  @Input() showConfirmButton: boolean = true
  @Input() openModalCondition: boolean = false
  @Input() showClose: boolean = true
  @Input() inputNeeded: boolean = true
  @Input() confirmContent: string = 'Save changes'
  @Input() modalTitle: string = 'this is the modal'
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() confirmModal = new EventEmitter<any>();
  inputFieldForm!: FormGroup;


  ngOnInit() {
    console.log("modal has been initialized bro")
    this.inputFieldForm = new FormGroup({
      inputData: new FormControl('', Validators.required),
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    console.log(this.modalBody, this.openModalCondition)
    this.openModalCondition ? this.modalToggle('show') : this.modalToggle('hide')
  }

  modalToggle(item?: any) {
    $('#exampleModalCenter').modal(item);
  }
  closeEvent() {
    console.log('emit')
    this.closeModal.emit(true)
  }

  confirmEvent(item?:any) {
    if(!item)
    this.confirmModal.emit(true)
  else
  {
    this.confirmModal.emit({eventAcknowledgement:true,inputFieldValue:this.inputFieldForm.value.inputData})
  
  }
  }
}
