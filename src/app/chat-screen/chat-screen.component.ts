import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import io from 'socket.io-client';
import { SarServiceService } from '../sar-service.service';
import { SocketServiceService } from '../socket-service.service';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css'],
})
export class ChatScreenComponent implements OnInit {
  constructor(private router: Router,
    private _route: ActivatedRoute,
    private _sarService: SarServiceService,
    private socketSer:SocketServiceService,
    private _signupLoginService: SignupLoginService,
    private toastr: ToastrService,
    private _fb: FormBuilder


  ) {}

  userID: any;
  socket: any;
  messageData: any;
  isPlaying: any = true;
  messagesArray: any = [];
  dataChunks: any = [];
  connectAFrndVar: any = false;
  fragment:any={}
  isGuest:any=false
  roomId:any
  ngOnInit() {
    // this.socketSer.socketInit()
    this._route.fragment.subscribe((data) => {
      console.log('this is teh nogojsfkjsdkj',data)
      if (data) {
        console.log('yes there is some data')
        this.fragment = this._sarService.decodeParams(data);
        console.log(this.fragment,'the fragment in the chat screen component');
        this.roomId=this.fragment.roomId
      }
    });
    this.userID = sessionStorage.getItem('userID');
      this.socketSer.messagesArray$.subscribe((messagesData:any)=>
        {
            this.messagesArray.push(messagesData);
        }
      )
      this.initMessageForm()
      this.getUserDetails()
  }
  audio: any;
  audioUrl: any = '';
  userDetails:any
  profilePic:any
  messageForm:any
  initMessageForm()
  {
    this.messageForm = this._fb.group({
      message:this._fb.control('')
    });
    }
  getUserDetails()
{
  this._signupLoginService.userDetails({userID:this.userID}).subscribe((response) => {
    response = this._sarService.decrypt(response.edc);
    if (response.success) {
      console.log(
        response,'these are thes user details');
      this.userDetails = response.data.data[0];
      console.log('these are teh user details in the chat screen component')
      this.profilePic=response.data.profilePic?`data:image/jpeg;base64,${response.data.profilePic}`:
      '../../assets/images/profile/default profile.jpg'

    } else {
      //!through toaster message
      this.toastr.error('error while fetching userDetails');

    }
  });
}

  sendMessage() //this is to send the message
   {
    if(this.messageForm?.value?.message?.length)
      {
        // myArray.unshift(newElement);
        console.log("into the send message")
        console.log(this.messageForm,'this is the message from')
        this.socketSer.sendMessage({message:this.messageForm.value.message,roomId:this.roomId,userId:this.userID})
        this.messageForm.reset()
      }
      else{
        this.toastr.warning('Empty messages cant be sent');

      }
  }
 
  navigateToMainMusic() {
    this.router.navigate(['/musicPlayer']);
  }
  groupSessionStarted()
  {
  const params=this.fragment
  // params['groupSession']='started'
    const connect=this._sarService.encodeParams(params)
    this.router.navigate(['/musicPlayer'],{fragment:connect});
  }
}
