// Import the necessary modules
import {
  Component,
  ElementRef,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as $ from 'jquery';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { SarServiceService } from '../sar-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common/common.service';
import io from 'socket.io-client';
import { SocketServiceService } from '../socket-service.service';

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
  roomId:any
  isGuest:any

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
    this.audioPlayer = new Audio(); 
    this.userID = sessionStorage.getItem('userID');
    this.getData();
    this.getRecommendationList({ shuffle: false });

    // this._route.fragment.subscribe((fragment) => {
    //   if (fragment) {
    //     this.fragment = this._sarService.decodeParams(fragment);
    //     if (this.fragment.groupSession) {
    //       this.groupSession = this.fragment.groupSession;
    //       this.isGuest=this.fragment.guest
    //       this.roomId=this.fragment.code
    //       if(this.isGuest)
    //         {
    //           this.socketSer.socketInit(this.userID)
    //         }

    //     }
    //     console.log(this.fragment, 'the fragment in the main music component');
    //   }
    // });

    // this.socketSer.playSongStream$.subscribe((event)=>
    //   {
    //     console.log(event,'thhis is the event form the play pause subscription')
    //     if(event)
    //       {
    //         this.audioPlayer.play();
    //         this.play = true;
    //       }
    //       else{
    //         this.audioPlayer.pause();
    //         this.play = false;
    //       }
    //   })
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
    }
    console.log('into the recommendations list fetching API', body);
    this._signupLoginService
      .fetchRecommendations(body)
      .subscribe((response) => {
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
      .subscribe((response) => {
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

  PlayerAction(e?: any, index?: any) {
    console.log("into the play action function")
    // if (this.groupSession == 'started') 
    //   {
    //     this.playGroupSessionSong(e,index)
    // }
    
    {
      this.playSongForSingleUser(e, index);
    }
    this.playerType = !this.playerType;
    this.playerOptions = false;
  }

//   playGroupSessionSong(e?: any, index?: any)
// {
//   console.log(this.isGuest,this.roomId,this.userID,'*****************')
//   this.socketSer.playStream({roomId: this.isGuest ? this.roomId : this.userID})
//       this.socketSer.dataChunks$.subscribe(chunks=>
//         {
//           this.dataChunks.push(chunks);
//           this.processAndPlayChunks()
//         }
//       )
// }

// processAndPlayChunks() {
//     this.audioPlayer = this.audioPlayerRef.nativeElement;
//     console.log(this.dataChunks,'this is teh data chunks from the service')
//     const blob = new Blob(this.dataChunks, { type: 'audio/mpeg' }); // Assuming MP3 format
//     const url = URL.createObjectURL(blob);
//     this.audioUrl = url;
//     this.audioPlayer.src = this.audioUrl;
//     this.audioPlayer.load();
//   }
  playSongForSingleUser(e?: any, index?: any) {
    if (e) {
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
    }
  }
  playNext() {
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
  playPrevious() {
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
    console.log("this is the fetch seleccted song functiom",body)
    //this.audioUrl = `http://localhost:3000/get/selected/music/file?s_id=${body.s_id}`;
    this.audioUrl = `http://192.168.1.23:3000/get/selected/music/file?s_id=${body.s_id}`;
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

  // playGrpAudio(ele: any)
  // {
  //   if(ele)
  //     {
  //       this.play=false
  //       this.socketSer.playSong({roomId: this.isGuest ? this.roomId : this.userID})
  //     }
  //   else
  //   {
  //     this.play=true
  //     this.socketSer.pauseSong({roomId: this.isGuest ? this.roomId : this.userID})
  //   }
  // }




  playAudio(ele: any) {
    if (ele) {
      this.audioPlayer.play();
      this.play = false;
    } else {
      this.audioPlayer.pause();
      this.play = true;
    }
  }

  // todo code related to this playvideo in  html is commented ..uncomment that during development
  PlayersOptions() {
    this.playerOptions = !this.playerOptions;
  }
  addPlaylist() {
    this.addPlayListVariable = true;
  }
  createPlaylist(e: any) {
    const body = { user_id: this.userID, playListName: e.inputFieldValue };
    if (e) {
      console.log(e, 'into the create playlist');
      this._signupLoginService.createPlayList(body).subscribe((response) => {
        response = this._sarService.decrypt(response.edc);
        if (response.success) {
          console.log(
            response,
            'this is the response in the get recommedations list api call'
          );
        } else {
          //!through toaster message
          console.log('error while fethcing the recommendations');
          this.toastr.error('error while fethcing the recommendations');
        }
      });
    }
  }
  playLists: any = [];
  fetchListOfPlayLists() {
    const body = { user_id: this.userID };
    this._signupLoginService.fetchPlayLists(body).subscribe((response) => {
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
      .subscribe((response) => {
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
    } else if (item.itemName == 'Play Video') {
      console.log('into video playing');
      this.playVideo();
    } else if (item.itemName == 'Connect a friend') {
      this.connectAFrndVar = true;
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
  connectFrnd(e: any) {
    console.log('connect a frnd event acknowledgment', e);
    {
      //type - host 1
      //guest 0
      const connect = this._sarService.encodeParams({ type: e.value });
      // this.router.navigate(['/connect'], {fragment:connect});
    }
  }
  showserProf() {
    this.userProf = true;
  }
  closeView(e: any) {
    if (e) this.userProf = false;
  }
}
