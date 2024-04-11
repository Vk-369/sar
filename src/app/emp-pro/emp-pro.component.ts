import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-emp-pro',
  templateUrl: './emp-pro.component.html',
  styleUrls: ['./emp-pro.component.css']
})
export class EmpProComponent {
  @Input() userId:string='u_Id_480'
  @Output() closeEmpView=new EventEmitter<boolean>();

  ngOnInit()
{
  console.log("modal has been initialized bro")
}
ngOnChanges(changes: SimpleChanges)
{
console.log(changes)
}
closeEvent()
{
  this.closeEmpView.emit(true)
}

}
