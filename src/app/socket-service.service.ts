import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import { SarServiceService } from './sar-service.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketServiceService {
  constructor(
    private _route: ActivatedRoute,
    private _sarService: SarServiceService
  ) {}
  socket: any;
  messagesArray: any = [];
  dataChunks: any = [];
  messageData: any;
  fragment: any = {};
  isGuest: any ;
  roomId: any;
  userID: any;
  dataChunks$ = new Subject<any[]>();
  messagesArray$ = new Subject<any[]>();
  playSongStream$ = new Subject<any>();

  socketInit(userId: any) {
    this._route.fragment.subscribe((fragment) => {
        if (fragment) {
          this.fragment = this._sarService.decodeParams(fragment);
          console.log(this.fragment,'the fragment in the chat screen component');
          this.isGuest=this.fragment.guest
          this.roomId=this.fragment.code
        }
      });
  
    this.userID = userId;
    this.socket = io('http://192.168.1.23:3000');
    this.handleSocketEvents(userId);
  }

  handleSocketEvents(userId: any) {
    this.socket.on('message', (data: any) => {
      console.log('message received from socket', data);
      this.messagesArray$.next(data);
    });
    this.socket.on('stream', (data: any) => {
      console.log(data, 'stream chunks');
      this.dataChunks$.next(data);
    });
    this.socket.on('resume play',()=>
    {
        this.playSongStream$.next(true)
    })
    this.socket.on('pause play',()=>
    {
        this.playSongStream$.next(false)
    })
  }

  createRoom(userID: any) {
    console.log('this is into the createroom socket', userID);
    this.socket.emit('create room', userID);
    this.joinRoom(userID);
  }

  joinRoom(roomID: any) {
    console.log(roomID, 'this is the room id in the input function');
    this.socket.emit('join room', roomID);
  }

  playStream(obj:any) {
    console.log(this.isGuest,this.roomId,'in the socket service')
    // this.socket.emit('play',{roomId: this.isGuest ? this.roomId : this.userID});
    this.socket.emit('play',obj);

  }
  sendMessage(message: any) {
    this.messageData = {
      roomId: this.isGuest ? this.roomId : this.userID,
      message: message,
      userId: this.userID,
    };
    console.log('into send message function', this.messageData);
    this.socket.emit('msg', this.messageData);
  }
  playSong(obj:any)
  {
    console.log('this is the object in teh play song event',obj)
    this.socket.emit('resume play',obj)

  }
  pauseSong(obj:any)
{
    this.socket.emit('pause play',obj)
}
// playNext()
// {
//     this.socket.emit('play next')
// }
// playPrev()
// {
//     this.socket.emit('play prev')

// }
// seek()
// {
//     this.socket.emit('seek')

// }

}
