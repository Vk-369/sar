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
  }
  audio: any;
  audioUrl: any = '';
 

  sendMessage(message: any) //this is to send the message
   {
    // myArray.unshift(newElement);
    console.log("into the send message")
    
    this.socketSer.sendMessage({message:message,roomId:this.roomId,userId:this.userID})
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
