import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent {
  @Input() modalBody:string='Into the modal';
  @Input() showConfirmButton: boolean = true
  @Input() openModalCondition:boolean=false
  @Input() modalTitle:string='this is the modal'
  @Output() closeModal=new EventEmitter<boolean>();
ngOnInit()
{
  console.log("modal has been initialized bro")
}
ngOnChanges(changes: SimpleChanges)
{
console.log(changes)
console.log(this.modalBody,'this is the modal body comming from the parent',this.openModalCondition)
this.openModalCondition ? this.modalToggle('show') : this.modalToggle('hide')
}

modalToggle(item:any) {
  $('#exampleModalCenter').modal(item);
}
closeEvent()
{
  this.closeModal.emit(true)
}
}
