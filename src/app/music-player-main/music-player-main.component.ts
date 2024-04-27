// Import the necessary modules
import { Component, OnInit } from '@angular/core';
import 'owl.carousel'; // Import Owl Carousel library
import * as $ from 'jquery';
import { SignupLoginService } from '../signup-or-login/signup-login.service';
import { SarServiceService } from '../sar-service.service';
import { DomSanitizer } from '@angular/platform-browser';

// Extend the JQuery interface to include the owlCarousel method

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
  audioUrl: any = String;
  safeUrl: any;
  openVideo: any = false;

  constructor(
    private _sarService: SarServiceService,
    private _signupLoginService: SignupLoginService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit() {
    this.getData();
    this.getRecommendationList();
  }

  getRecommendationList() {
    console.log('into the recommendations list fetching API');
    this._signupLoginService.fetchRecommendations().subscribe((response) => {
      response = this._sarService.decrypt(response.edc);
      if (response.success) {
        console.log(
          response,
          'this is the response in the get recommedations list api call'
        );
        this.recommendations = response.data;
      } else {
        //!through toaster message
        console.log('error while fethcing the recommendations');
      }
    });
  }

  selectedAction() {
    this.selected = !this.selected;
  }

  openModal() {
    this.modalActive = !this.modalActive;
  }
  SearchAction() {
    this.searchType = !this.searchType;
  }

  statusAction() {
    this.songStatus = !this.songStatus;
  }

  PlayerAction(e?: any) {
    if (e) {
      console.log('this is the selected song', e?._id);
      const body: any = {};
      body['s_id'] = e.id;
      this.fetchSelectedSong({ s_id: e._id });
    }
    this.playerType = !this.playerType;
    this.playerOptions = false;
  }
  videoId: any;
  fetchSelectedSong(body: any) {
    console.log(body, 'this is the body to fetch the selected song');
    this._signupLoginService
      .getSelectedSong(body)
      .subscribe((response: any) => {
        response = this._sarService.decrypt(response.edc);
        console.log(response, 'this is the response ************');
        if (response.success) {
          console.log(response, 'this is the response in seletced song api');
          this.base64String = response.song;
          this.videoId = response.videoId;
          this.playAudio();
        } else {
          //!through toaster message
          console.log('error while fethcing the selected song');
        }
      });
  }

  playVideo() {
    this.openVideo = true;
    const videoId = this.videoId; // Replace with your video ID
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }

  playAudio() {
    const binaryString = window.atob(this.base64String);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/mp3' });
    this.audioUrl = window.URL.createObjectURL(blob);
  }

  PlayersOptions() {
    this.playerOptions = !this.playerOptions;
  }

  getData() {
    this.optionsList = [
      {
        itemName: 'Like',
        itemIcon: 'heart',
      },
      {
        itemName: 'Hide this song',
        itemIcon: 'heart',
      },
      {
        itemName: 'Add to playlist',
        itemIcon: 'heart',
      },
      {
        itemName: 'Connect friend',
        itemIcon: 'users',
      },
      {
        itemName: 'Play Video',
        itemIcon: 'users',
      },
      {
        itemName: 'lyrics',
        itemIcon: 'users',
      },
    ];
  }
  showserProf() {
    this.userProf = true;
  }
  closeView(e: any) {
    if (e) this.userProf = false;
  }
}
