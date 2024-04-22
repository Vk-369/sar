import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() confirmContent: string = 'Save changes'
  @Input() modalTitle: string = 'this is the modal'
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() confirmModal = new EventEmitter<boolean>();

  ngOnInit() {
    console.log("modal has been initialized bro")
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    console.log(this.modalBody, this.openModalCondition)
    this.openModalCondition ? this.modalToggle('show') : this.modalToggle('hide')
  }

  modalToggle(item: any) {
    $('#exampleModalCenter').modal(item);
  }
  closeEvent() {
    console.log('emit')
    this.closeModal.emit(true)
  }

  confirmEvent() {
    this.confirmModal.emit(true)
  }
}
