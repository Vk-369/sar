// Import the necessary modules
import {
  Component,
  ElementRef,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
// import * as $ from 'jquery';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { SarServiceService } from '../sar-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common/common.service';
import io from 'socket.io-client';
import { SocketServiceService } from '../socket-service.service';
import { env } from 'src/assets/env';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-music-player-main',
  templateUrl: './music-player-main.component.html',
  styleUrls: ['./music-player-main.component.css'],
})
export class MusicPlayerMainComponent implements OnInit {
  songStatus: any = false;
  playerType: any = false;
  playerOptions: any = false;
  selected: any = false;
  modalActive: any = false;
  searchType: any = false;
  optionsList: any = [];
  userProf: boolean = false;
  recommendations: any = [];
  base64String: any = String;
  safeUrl: any;
  openVideo: any = false;
  musicData: any;
  audioUrl: any;
  audio: any;
  currentTime: any;
  totalTime: any;
  songPic: any;
  play: any;
  audioPlayer: any;
  currentSongIndex: any;
  addPlayListVariable: any = false;
  connectAFrndVar: any = false;
  picLoaded: any = false;
  isFullScreen: any = false;
  userID: any;
  checked: any = false;
  songName: any;
  artistName: any;
  videoId: any;
  addingToPlayListCheck: any = false;
  fragment: any;
  groupSession: any;
  selectedSong: any;
  dataChunks: any = [];
  checkedIndex: any;
  roomId: any;
  isGuest: any;
  urlPrefix: any;
  isConnected: any = false;
  playConnection: any = false;
  inputFieldForm!: FormGroup;
  playListForm!: FormGroup;

  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef;
  constructor(
    private _sarService: SarServiceService,
    private _signupLoginService: SignupLoginService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private _route: ActivatedRoute,
    private commonService: CommonService,
    private socketSer: SocketServiceService
  ) {}

  ngOnInit() {
    this.urlPrefix = env.apiUrl;
    console.log(env.apiUrl, 'this is the api url in the env', this.urlPrefix);
    this.audioPlayer = new Audio();
    this.userID = sessionStorage.getItem('userID');
    this.getData();
    this.getRecommendationList({ shuffle: false });
    this._route.fragment.subscribe((fragment) => {
      console.log('oninit of main music player component', fragment);
      if (fragment) {
        // this.socketSer.socketInit()
        this.isConnected = true;
        this.fragment = this._sarService.decodeParams(fragment);
        this.roomId = this.fragment.roomId;
        this.playGroupSessionSong('e', 'index'); //to subscribe the stream
      }
    });

    this.socketSer.playSongStream$.subscribe((event) => {
      console.log(event, 'thhis is the event form the play pause subscription');
      if (event === 'resume play') {
        this.audioPlayer.play();
        this.playConnection = false;
      } else if (event === 'pause play') {
        this.audioPlayer.pause();
        this.playConnection = true;
      }
    });

    this.initForm();
    this.initPlayListForm()
  }

  initForm() {
    this.inputFieldForm = new FormGroup({
      radioValue: new FormControl(''),
      inputData: new FormControl('', Validators.required),
    });

  }
 
  ngAfterViewInit() {
    this.audioPlayerRef.nativeElement.addEventListener('timeupdate', () => {
      this.updateTime();
    });

    this.audioPlayerRef.nativeElement.addEventListener('loadedmetadata', () => {
      this.updateTotalTime();
    });
    this.audioPlayerRef.nativeElement.addEventListener('ended', () => {
      this.playNext();
    });
  }
  copyToClipBoard() {
    navigator.clipboard.writeText(this.userID).then(() => {
      console.log('copied to the clipboard');
    }),
      (err: any) => {
        console.log('error while copying the data');
      };
  }
  updateTime() {
    const audioPlayer: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    const currentTime = audioPlayer.currentTime;
    this.currentTime = this.formatTime(currentTime);
  }

  updateTotalTime() {
    const audioPlayer: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    const totalTime = audioPlayer.duration;
    this.totalTime = this.formatTime(totalTime);
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = Math.floor(seconds % 60);
    const formattedTime: string =
      (minutes < 10 ? '0' : '') +
      minutes +
      ':' +
      (remainingSeconds < 10 ? '0' : '') +
      remainingSeconds;
    return formattedTime;
  }

  //! for default songs list
  getRecommendationList(body?: any) {
    this.songsListShimmer = true;
    if (body.shuffle) {
      this.playerType = !this.playerType;
      this.playerOptions = false;
      console.log('this.playerType 1', this.playerType);
    }
    console.log('into the recommendations list fetching API', body);
    this._signupLoginService
      .fetchRecommendations(body)
      .subscribe((response:any) => {
        response = this._sarService.decrypt(response.edc);
        if (response.success) {
          console.log(
            response,
            'this is the response in the get recommedations list api call'
          );
          this.songsListShimmer = false;

          this.recommendations = response.data;
        } else {
          //!through toaster message
          this.songsListShimmer = false;
          this.toastr.error('error while fetching recommendations');

          console.log('error while fethcing the recommendations');
        }
      });
  }

  fullScreen() {
    const element = document.documentElement as any;

    if (!document.fullscreenElement) {
      this.isFullScreen = true;
      element
        .requestFullscreen()
        .then(() => {
          console.log('Entered full screen mode successfully');
        })
        .catch((err: any) => {
          console.error('Error while entering full screen mode:', err.message);
        });
    } else {
      this.isFullScreen = false;

      document
        .exitFullscreen()
        .then(() => {
          console.log('Exited full screen mode successfully');
        })
        .catch((err: any) => {
          console.error('Error while exiting full screen mode:', err.message);
        });
    }
  }
  makeChecked(index: any) {
    this.checkedIndex = index;
  }

  selectedAction() {
    this.selected = !this.selected;
  }
  playListfunctionCall(item: any, index: any) {
    if (!this.addingToPlayListCheck) {
      this.fetchSongsLinkedToPlayList(item);
      this.closeModal();
    } else if (this.addingToPlayListCheck) {
      //api call to add the song in a particular playlist
      console.log('api call to add the song in a particular playlist', item);
      this.addingToPlayListCheck = true;
      this.makeChecked(index);
      this.insertSongIntoThePlayList(item.p_id);
    }
  }
  insertSongIntoThePlayList(p_id: any) {
    const body = { songId: this.selectedSong, playListId: p_id };
    this._signupLoginService
      .insertSongIntoPlayList(body)
      .subscribe((response:any) => {
        response = this._sarService.decrypt(response.edc);
        console.log(response, 'response after the insertion');
        if (response.success) {
          console.log(
            response,
            'this is the response in the get recommedations list api call'
          );
          this.toastr.success('Song Added Successfully');
          this.closeModal();
          this.checkedIndex = -1;
        } else {
          //!through toaster message
          this.toastr.warning(response.message);
          this.closeModal();
          this.checkedIndex = -1;

          // this.toastr.error(response.message,'',{ toastClass: 'toast-error' });
        }
      });
  }
  goToChatPage() {
    const params = { ...this.fragment };
    console.log(params, '()()()()()()', this.fragment);
    const connect = this._sarService.encodeParams(params);
    this.router.navigate(['/connect'], { fragment: connect });
  }

  openModal() {
    this.addPlayListVariable = false;
    this.fetchListOfPlayLists();
    this.modalActive = !this.modalActive;
  }
  closeModal() {
    this.modalActive = !this.modalActive;
  }
  SearchAction() {
    this.searchType = !this.searchType;
  }

  statusAction() {
    this.songStatus = !this.songStatus;
  }
  multipleUserSongIndex: any = 0;
  //will be called only on clicking a particular song
  PlayerAction(e?: any, index?: any) {
    console.log('into the play action function');
    if (this.fragment && this.fragment.roomId) {
      console.log(e._id, 'this is the e in the connectivity');
      this.multipleUserSongIndex = index;
      this.fetchSelectedSongForGrp(e._id); //to start the stream
      // this.playGroupSessionSong(e,index)//to subscribe the stream
    } else {
      console.log(
        'inot the else statement in which fetch selected song is getting called'
      );
      this.playSongForSingleUser(e, index);
    }
    // this.playerType = !this.playerType;
    this.playerType = true;
    this.playerOptions = false;
    console.log('this.playerType 2', this.playerType);
  }
  timeJumpDuplicate: any;
  playGroupSessionSong(e?: any, index?: any) {
    console.log('this is called the funciton');

    // console.log(this.isGuest,this.roomId,this.userID,'*****************')
    // this.socketSer.playStream({roomId: this.isGuest ? this.roomId : this.userID})
    this.socketSer.dataChunks$.subscribe((chunks) => {
      console.log('subscribed');
      this.dataChunks.push(chunks);
      this.processAndPlayChunks();
    });
    this.socketSer.metaData$.subscribe((data) => {
      this.dataChunks = [];

      console.log('meta data in the music player file', data);
      this.songPic = data?.image_url
        ? data?.image_url
        : '../../assets/images/defaultImage.jpg';
      this.songName = data?.s_displayName;
      this.artistName = data?.artist;
    });
    this.socketSer.playNext$.subscribe((data) => {
      this.multipleUserSongIndex = data.songIndex;
      console.log(data, 'data in the required subscription');
    });
    this.socketSer.playPrev$.subscribe((data) => {
      this.multipleUserSongIndex = data.songIndex;
      console.log(data, 'data in the required subscription');
    });
    this.socketSer.songSeeking$.subscribe((data) => {
      // this.audioPlayer.pause()
      this.timeJumpDuplicate = data.timeJump;
      this.audioPlayer.currentTime = data.timeJump;
      this.audioPlayer.play();
    });
  }

  processAndPlayChunks() {
    this.audioUrl = '';
    this.audioPlayer.load();
    this.audioPlayer = this.audioPlayerRef.nativeElement;
    console.log(this.dataChunks, 'this is teh data chunks from the service');
    const blob = new Blob(this.dataChunks, { type: 'audio/mpeg' }); // Ass uming MP3 format
    const url = URL.createObjectURL(blob);
    console.log(this.audioUrl, 'this is the audio url');
    this.audioPlayer.pause();
    this.audioUrl = url;
    this.audioPlayer.src = this.audioUrl;

    console.log(
      'this is the completion of the function process adn play chunks'
    );

    this.playerType = true;
  }

  playGrpAudio(ele: any) {
    // this.audioPlayer.play()

    if (ele == 'play') {
      console.log('play group event');
      // this.audioPlayer.load();
      // this.play=false
      this.socketSer.playSong({ roomId: this.roomId });
    } else if (ele == 'pause') {
      // this.play=true
      console.log('pause group event');
      this.socketSer.pauseSong({ roomId: this.roomId });
    }
  }
  playSongForSingleUser(e?: any, index?: any) {
    if (e) {
      console.log('##################################');
      console.log(e, 'this is the selected song', e?._id);
      this.selectedSong = e._id;
      const body: any = {};
      body['s_id'] = e.id;
      this.videoId = e.videoId;
      this.fetchSelectedSong({ s_id: e._id });
      // this.songPic=e.s_pic_path
      this.songPic = e?.image_url
        ? e?.image_url
        : '../../assets/images/defaultImage.jpg';
      this.songName = e?.s_displayName;
      this.artistName = e?.artist;
      this.currentSongIndex = index;
      console.log(this.currentSongIndex, 'this is the current song index');
    }
  }

  playNext() {
    console.log('this is into the play next out of the condition');
    if (this.roomId && this.roomId.length) {
      console.log('this is into the play next inside the if condition');
      this.playNextForMultipleUsers();
    } else if (!this.roomId) {
      console.log('this is into the play next into the else condtion');
      this.playNextForSingleUser();
    }
  }
  playNextForSingleUser() {
    if (this.currentSongIndex < this.recommendations.length - 1) {
      this.audioPlayer.pause();
      this.currentSongIndex += 1;
      const nextSong = this.recommendations[this.currentSongIndex];
      console.log(nextSong, 'the next song item');
      if (nextSong) {
        this.fetchSelectedSong({ s_id: nextSong._id }, true);
        this.songName = nextSong?.s_displayName;
        this.artistName = nextSong?.artist;
        this.songPic = nextSong?.image_url
          ? nextSong?.image_url
          : '../../assets/images/defaultImage.jpg';
      }
    }
  }
  playNextForMultipleUsers() {
    if (this.multipleUserSongIndex < this.recommendations.length - 1) {
      this.multipleUserSongIndex += 1;
      this.socketSer.playNext({
        songIndex: this.multipleUserSongIndex,
        roomId: this.roomId,
      });
      this.dataChunks = [];
      this.audioPlayer.pause();
      const nextSong = this.recommendations[this.multipleUserSongIndex];
      console.log(nextSong, 'the next song item');
      if (nextSong) {
        this.fetchSelectedSongForGrp(nextSong._id);
      }
    }
  }
  playPrevious() {
    if (this.roomId && this.roomId.length) {
      console.log('this is into the play next inside the if condition');
      this.playPrevForMultipleUsers();
    } else if (!this.roomId) {
      console.log('this is into the play next into the else condtion');
      this.playPrevForSingleUser();
    }
  }
  playPrevForMultipleUsers() {
    if (this.multipleUserSongIndex > 0) {
      this.audioPlayer.pause();
      this.multipleUserSongIndex -= 1;
      this.socketSer.playPrev({
        songIndex: this.multipleUserSongIndex,
        roomId: this.roomId,
      });

      const nextSong = this.recommendations[this.multipleUserSongIndex];
      console.log(nextSong, 'the next song item');
      if (nextSong) {
        this.fetchSelectedSongForGrp(nextSong._id);
      }
    }
  }

  playPrevForSingleUser() {
    if (this.currentSongIndex > 0) {
      this.audioPlayer.pause();
      this.currentSongIndex -= 1;
      const nextSong = this.recommendations[this.currentSongIndex];
      console.log(nextSong, 'the next song item');
      if (nextSong) {
        this.fetchSelectedSong({ s_id: nextSong._id }, true);
        this.songName = nextSong?.s_displayName;
        this.artistName = nextSong?.artist;
        this.songPic = nextSong?.image_url
          ? nextSong?.image_url
          : '../../assets/images/defaultImage.jpg';
      }
    }
  }

  fetchSelectedSong(body: any, nextSong?: any) {
    console.log(
      'this is the fetch seleccted song functiom',
      body,
      this.urlPrefix
    );
    this.audioUrl = `${this.urlPrefix}/get/selected/music/file?s_id=${body.s_id}`;
    setTimeout(() => {
      this.audioPlayer = this.audioPlayerRef.nativeElement;
      this.audioPlayer.src = this.audioUrl;
      this.audioPlayer.load();
      if (nextSong) {
        this.playAudio(1);
      }
    }, 0);
  }

  songPicLoaded() {
    this.picLoaded = false;
    setTimeout(() => {
      this.picLoaded = true;
    }, 1000);
    console.log('image loaded from the src');
    //! there should be a shimmer untill the images gets loaded from the assets folder
  }

  fetchSelectedSongForGrp(songId: any) {
    console.log(songId, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    //we have to send the song id as well
    // {roomId:this.roomId,songId:songId}
    const obj = { roomId: this.roomId, songId: songId };
    console.log(obj, 'the obj in the normal component');
    this.socketSer.playStream(obj);
  }

  playAudio(ele: any) {
    if (ele) {
      // this.audioPlayer.currentTime = 30
      this.audioPlayer.play();
      this.play = false;
    } else {
      this.audioPlayer.pause();
      this.play = true;
    }
  }
  timeJump: any = 0;
  seeking: any = false;
  onSeeking(e: any) {
    console.log(e, 'this is the event in the seeking function');
    if (this.roomId && e) {
      this.seeking = true;
      console.log(e, 'this is the seeking event in the audio tag');
      this.timeJump = this.audioPlayer.currentTime;
      const obj = { roomId: this.roomId, timeJump: this.timeJump };
      if (this.timeJumpDuplicate != this.audioPlayer.currentTime)
        this.socketSer.seek(obj);
    }
  }

  PlayersOptions() {
    this.playerOptions = !this.playerOptions;
    this.initPlayListForm()
  }
  initPlayListForm()
  {
    this.playListForm = new FormGroup({
      playListName: new FormControl('', Validators.required),
    });
  }
  addPlaylist() {
    this.addPlayListVariable = true;
    this.commonService.modalToggle('addPlayListModel','show')
    
  }
  
  createPlaylist(e?: any) {
    const body = { user_id: this.userID, playListName: this.playListForm?.value?.playListName};
          console.log('into the create playlist');
      this._signupLoginService.createPlayList(body).subscribe((response:any) => {
        response = this._sarService.decrypt(response.edc);
        if (response.success) {
          console.log(response,'this is the response in the get recommedations list api call');
        }
         else {
          //!through toaster message
          console.log('error while fethcing the recommendations');
          this.toastr.error('error while fethcing the recommendations');
        }
      });
    
  }
  playLists: any = [];
  fetchListOfPlayLists() {
    const body = { user_id: this.userID };
    this._signupLoginService.fetchPlayLists(body).subscribe((response:any) => {
      response = this._sarService.decrypt(response.edc);
      if (response.success) {
        this.playLists = response.data;
        console.log(
          response,
          'this is the response from the play lists fetch api'
        );
      } else {
        //!through toaster message
        this.toastr.error('error while fetching playlists');
      }
    });
  }
  songsListShimmer: any = false;
  fetchSongsLinkedToPlayList(item: any) {
    this.songsListShimmer = true;
    console.log(this.songsListShimmer, '****************');
    const body = { playListId: item.p_id };
    this._signupLoginService
      .fetchPlayListLinkedSongs(body)
      .subscribe((response:any) => {
        response = this._sarService.decrypt(response.edc);
        if (response.success) {
          // this.playLists=response.data
          this.recommendations = response.data;
          this.songsListShimmer = false;
          console.log(this.songsListShimmer, '****************');
        } else {
          //!through toaster message
          this.songsListShimmer = false;
          this.toastr.error('error while fetching songs of playlist');
        }
      });
  }
  optionSelected(item: any) {
    console.log('into the option selected function', item);
    if (item.itemName == 'Add to playlist') {
      console.log('yes in to if condiont');
      this.fetchListOfPlayLists();
      this.addingToPlayListCheck = true;
      this.playerOptions = false;
      this.playerType = false;
      this.modalActive = true;
      console.log('this.playerType 3', this.playerType);
    } else if (item.itemName == 'Play Video') {
      console.log('into video playing');
      this.playVideo();
    } else if (item.itemName == 'Connect a friend') {
      this.connectAFrndVar = true;
      this.initForm();
      this.commonService.modalToggle('connectFrndModel','show');
      this.socketSer.socketInit();
    }
  }


  playVideo() {
    this.openVideo = true;
    const videoId = 'MoN9ql6Yymw'; // Replace with your video ID
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
    console.log(this.safeUrl, 'this is the safe url');
  }
  getData() {
    this.optionsList = [
      {
        itemName: 'Like',
        itemIcon: 'heart',
      },
      {
        itemName: 'Add to playlist',
        itemIcon: 'plus-square',
      },
      {
        itemName: 'Connect a friend',
        itemIcon: 'link',
      },
      {
        itemName: 'Play Video',
        itemIcon: 'video',
      },
      {
        itemName: 'lyrics',
        itemIcon: 'music',
      },
      {
        itemName: 'Request a song',
        itemIcon: 'envelope',
      },
    ];
  }

  guest: any = false;
  connectFrnd(e?: any) {
    {
      this.playerType = false;
      console.log('this.playerType 4', this.playerType);

      this.playerOptions = false;
      if (this.inputFieldForm?.value?.radioValue == 2) {
        //for host
        //creating a room using the userID of the host
        console.log('into the room creation');
        this.socketSer.createRoom(this.userID);
        const connect = this._sarService.encodeParams({
          host: true,
          guest: false,
          roomId: this.userID,
        });
        this.router.navigate(['/musicPlayer'], { fragment: connect });
      } else if (this.inputFieldForm?.value?.radioValue == 1) {
        //for guest
        this.socketSer.joinRoom(this.inputFieldForm.value.inputData);

        const connect = this._sarService.encodeParams({
          host: false,
          guest: true,
          roomId: this.inputFieldForm.value.inputData,
        });
        this.router.navigate(['/musicPlayer'], { fragment: connect });
      }
    }
  }
  showserProf() {
    this.userProf = true;
  }
  closeView(e: any) {
    if (e) this.userProf = false;
  }
}
