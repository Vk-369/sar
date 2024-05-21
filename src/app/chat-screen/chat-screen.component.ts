import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import io from 'socket.io-client';
import { SarServiceService } from '../sar-service.service';
import { SocketServiceService } from '../socket-service.service';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css'],
})
export class ChatScreenComponent implements OnInit {
  constructor(private router: Router,
    private _route: ActivatedRoute,
    private _sarService: SarServiceService,
    private socketSer:SocketServiceService
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
    // this._route.fragment.subscribe((fragment) => {
    //   if (fragment) {
    //     this.fragment = this._sarService.decodeParams(fragment);
    //     console.log(this.fragment,'the fragment in the chat screen component');
    //     this.isGuest=this.fragment.guest
    //     this.roomId=this.fragment.code
    //   }
    // });
    this.userID = sessionStorage.getItem('userID');
    // this.audio = new Audio();
    // this.audio.pause();
    // this.socketSer.socketInit(this.userID)
    // if(!this.isGuest)
    //   {
    //     //this means this user is the host and so need to create a room using his empId
    //     this.socketSer.createRoom(this.userID)
    //   }
    // if(this.isGuest)
    //   {
    //     this.socketSer.joinRoom(this.roomId)
    //   }

    //   this.socketSer.messagesArray$.subscribe((messagesData:any)=>
    //     {
    //         this.messagesArray.push(messagesData);
    //     }
    //   )
  }
  audio: any;
  audioUrl: any = '';
 

  sendMessage(message: any) //this is to send the message
   {
    // myArray.unshift(newElement);
    this.socketSer.sendMessage(message)
  }
 
  navigateToMainMusic() {
    this.router.navigate(['/musicPlayer']);
  }
  // groupSessionStared()
  // {
  // const params=this.fragment
  // params['groupSession']='started'
  //   const connect=this._sarService.encodeParams(params)
  //   this.router.navigate(['/musicPlayer'],{fragment:connect});
  // }
}
