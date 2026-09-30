import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { BehaviorSubject, Subject } from 'rxjs';
import { env } from 'src/assets/env';


@Injectable({
  providedIn: 'root',
})
export class SocketServiceService {
  constructor() {}
  socket: any;
  messagesArray$ = new Subject<any[]>();
  playSongStream$ = new Subject<any>();
  metaData$ = new Subject<any>();
  playbackSync$ = new Subject<any>();
  playbackError$ = new Subject<any>();
  connectionStatus$ = new BehaviorSubject<boolean>(false);
  playNext$ = new Subject<any>();
  playPrev$ = new Subject<any>();
  songSeeking$ = new Subject<any>();
  urlPrefix: any;
  private joinedRooms = new Set<string>();

  socketInit() {
    this.urlPrefix = env.apiUrl;
    if (this.socket) {
      if (!this.socket.connected) this.socket.connect();
      return;
    }

    this.socket = io(this.urlPrefix, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    this.socket.on('connect', () => {
      this.connectionStatus$.next(true);
      this.joinedRooms.forEach((roomId) => this.socket.emit('join room', roomId));
    });
    this.socket.on('disconnect', () => this.connectionStatus$.next(false));
    this.handleSocketEvents();
  }

  handleSocketEvents() {
    this.socket.on('message', (data: any) => {
      console.log('message received from socket', data);
      this.messagesArray$.next(data);
    });
    this.socket.on('resume play', () => this.playSongStream$.next('resume play'));
    this.socket.on('pause play', () => this.playSongStream$.next('pause play'));
    this.socket.on('metaData', (data: any) => this.metaData$.next(data));
    this.socket.on('playback:sync', (data: any) => this.playbackSync$.next(data));
    this.socket.on('playback:error', (data: any) => this.playbackError$.next(data));
    this.socket.on('next play this', (data: any) => this.playNext$.next(data));
    this.socket.on('previous play this', (data: any) => this.playPrev$.next(data));
    this.socket.on('song seeking', (data: any) => this.songSeeking$.next(data));
  }

  createRoom(userID: any) {
    const roomId = String(userID ?? '').trim();
    if (!roomId) return;
    this.joinedRooms.add(roomId);
    if (this.socket?.connected) this.socket.emit('create room', roomId);
  }

  joinRoom(roomID: any) {
    const roomId = String(roomID ?? '').trim();
    if (!roomId) return;
    this.joinedRooms.add(roomId);
    if (this.socket?.connected) this.socket.emit('join room', roomId);
  }

  leaveRoom(roomID: any) {
    const roomId = String(roomID ?? '').trim();
    if (!roomId) return;
    this.joinedRooms.delete(roomId);
    if (this.socket?.connected) this.socket.emit('leave room', roomId);
  }

  playStream(obj: any) {
    this.socket?.emit('play', obj);
  }
  sendMessage(data: any) {
    console.log('into send message function',data);
    this.socket?.emit('msg', data);
  }
  playSong(obj: any) {
    this.socket?.emit('resume play', obj);
  }
  pauseSong(obj: any) {
    this.socket?.emit('pause play', obj);
  }
  playNext(data: any) {
    this.socket?.emit('play next', data);
  }
  playPrev(data: any) {
    this.socket?.emit('play previous one', data);
  }
  seek(data: any) {
    this.socket?.emit('seek', data);
  }
  disconnect() {
    this.joinedRooms.clear();
    this.socket?.disconnect();
    this.socket = undefined;
    this.connectionStatus$.next(false);
  }
}
