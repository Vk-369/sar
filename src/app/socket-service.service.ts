import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import { SarServiceService } from './sar-service.service';
import { Subject } from 'rxjs';
import { env } from 'src/assets/env';


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
  userID: any;
  dataChunks$ = new Subject<any[]>();
  messagesArray$ = new Subject<any[]>();
  playSongStream$ = new Subject<any>();
  metaData$ = new Subject<any>();
  playNext$ = new Subject<any>();
  playPrev$ = new Subject<any>();
  songSeeking$ = new Subject<any>();
  urlPrefix:any

  socketInit() {
    this.urlPrefix=env.apiUrl
    // this.userID = userId;
    // this.socket = io('http://192.168.1.23:3000');
    this.socket = io(`${this.urlPrefix}`);
    this.handleSocketEvents();
  }

  handleSocketEvents() {
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
        this.playSongStream$.next('resume play')
    })
    this.socket.on('pause play',()=>
    {
        this.playSongStream$.next('pause play')
    })
    
    this.socket.on('metaData',(data:any)=>
    {
        // this.playSongStream$.next('pause play')
        console.log(data,'this is the metadata')
        this.metaData$.next(data)
    })
    this.socket.on('next play this',(data:any)=>
    {
        // this.playSongStream$.next('pause play')
        console.log(data,'this is the metadata')
        this.playNext$.next(data)
    })
    this.socket.on('play previous one',(data:any)=>
    {
        // this.playSongStream$.next('pause play')
        console.log(data,'this is the metadata')
        this.playPrev$.next(data)
    })
    
    this.socket.on('song seeking',(data:any)=>
    {
        // this.playSongStream$.next('pause play')
        console.log(data,'this is the songseeking')
        this.songSeeking$.next(data)
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
    console.log(obj,'the object in the service')
    this.socket.emit('play',obj);

  }
  sendMessage(data: any) {
    console.log('into send message function',data);
    this.socket.emit('msg', data);
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
playNext(data:any)
{
    this.socket.emit('play next',data)
}
playPrev(data:any)
{
    this.socket.emit('play prev',data)

}
seek(data:any)
{
  console.log('this is the service seeking')
    this.socket.emit('seek',data)

}
disconnect()
{
  this.socket.disconnect()
}

}
