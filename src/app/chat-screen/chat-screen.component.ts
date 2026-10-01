import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SarServiceService } from '../sar-service.service';
import { SocketServiceService } from '../socket-service.service';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { env } from 'src/assets/env';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css'],
})
export class ChatScreenComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @ViewChild('roomAudio') private roomAudioRef!: ElementRef<HTMLAudioElement>;
  private subscriptions: Subscription[] = [];
  private pendingPlaybackSync: any;
  private pendingRoomSong: any;
  private currentSongId: string | null = null;
  playbackNeedsGesture = false;
  ngOnInit() {
    this.socketSer.socketInit();
    this.subscriptions.push(this._route.fragment.subscribe((data) => {
      if (data) {
        this.fragment = this._sarService.decodeParams(data);
        this.roomId = this.fragment?.roomId;
        if (this.roomId) this.socketSer.joinRoom(this.roomId);
      }
    }));
    this.userID = sessionStorage.getItem('userID');
    this.subscriptions.push(this.socketSer.messagesArray$.subscribe((message: any) => {
      if (String(message?.roomId) === String(this.roomId)) {
        this.messagesArray.push(message);
      }
    }));
    this.subscriptions.push(this.socketSer.metaData$.subscribe((song: any) => {
      if (song?.roomId && String(song.roomId) !== String(this.roomId)) return;
      this.setRoomSong(song);
    }));
    this.subscriptions.push(this.socketSer.playbackSync$.subscribe((state: any) => {
      if (String(state?.roomId) !== String(this.roomId)) return;
      const audio = this.roomAudioRef?.nativeElement;
      if (!audio || audio.readyState < 1) {
        this.pendingPlaybackSync = state;
        return;
      }
      this.applyRoomPlaybackSync(state);
    }));
    this.initMessageForm();
    this.getUserDetails();
  }

  ngAfterViewInit() {
    if (this.pendingRoomSong) {
      const song = this.pendingRoomSong;
      this.pendingRoomSong = undefined;
      this.setRoomSong(song);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    const audio = this.roomAudioRef?.nativeElement;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
  }

  onRoomAudioMetadataLoaded() {
    if (!this.pendingPlaybackSync) return;
    const state = this.pendingPlaybackSync;
    this.pendingPlaybackSync = undefined;
    this.applyRoomPlaybackSync(state);
  }

  private setRoomSong(song: any) {
    if (!song?._id) return;
    const audio = this.roomAudioRef?.nativeElement;
    if (!audio) {
      this.pendingRoomSong = song;
      return;
    }
    const songId = String(song._id);
    if (songId === this.currentSongId) return;
    this.currentSongId = songId;
    const userQuery = this.userID
      ? `&user_ID=${encodeURIComponent(this.userID)}`
      : '';
    audio.src = `${env.apiUrl}/get/selected/music/file?s_id=${encodeURIComponent(songId)}${userQuery}`;
    audio.load();
  }

  resumeRoomAudio() {
    this.roomAudioRef.nativeElement.play().then(() => {
      this.playbackNeedsGesture = false;
    }).catch(() => {
      this.playbackNeedsGesture = true;
    });
  }

  private applyRoomPlaybackSync(state: any) {
    const audio = this.roomAudioRef?.nativeElement;
    if (!audio) {
      this.pendingPlaybackSync = state;
      return;
    }
    const networkDelay = state.playing && Number.isFinite(Number(state.serverTime))
      ? Math.max(0, (Date.now() - Number(state.serverTime)) / 1000)
      : 0;
    const targetTime = Math.max(0, (Number(state.position) || 0) + networkDelay);
    if (Math.abs(audio.currentTime - targetTime) > 1) audio.currentTime = targetTime;

    if (state.playing) {
      audio.play().then(() => {
        this.playbackNeedsGesture = false;
      }).catch(() => {
        this.playbackNeedsGesture = true;
      });
    } else {
      audio.pause();
      this.playbackNeedsGesture = false;
    }
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
    const navigation = this.roomId
      ? { fragment: this._sarService.encodeParams(this.fragment) }
      : {};
    this.router.navigate(['/musicPlayer'], navigation);
  }
  groupSessionStarted()
  {
  const params=this.fragment
  // params['groupSession']='started'
    const connect=this._sarService.encodeParams(params)
    this.router.navigate(['/musicPlayer'],{fragment:connect});
  }
}
