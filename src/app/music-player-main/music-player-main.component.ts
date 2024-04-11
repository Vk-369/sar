// Import the necessary modules
import { Component, OnInit } from '@angular/core';
import 'owl.carousel'; // Import Owl Carousel library
import * as $ from 'jquery';

// Extend the JQuery interface to include the owlCarousel method

@Component({
  selector: 'app-music-player-main',
  templateUrl: './music-player-main.component.html',
  styleUrls: ['./music-player-main.component.css']
})
export class MusicPlayerMainComponent implements OnInit {
  songStatus:any = false;
  playerType:any = false;
  playerOptions:any = false;
  selected: any = false;
  modalActive: any = false;
  searchType: any = false;
  optionsList: any = [];
  userProf:boolean=false
  ngOnInit() {
    this.getData();
  }
  
  selectedAction() {
    this.selected = !this.selected;
  }
  

  openModal(){
    this.modalActive = !this.modalActive;
  }
  SearchAction(){
    this.searchType = !this.searchType;
  }

  statusAction(){
    this.songStatus = !this.songStatus;
  }
  
  PlayerAction(){
    this.playerType = !this.playerType;
    this.playerOptions = false;
  }
  
  PlayersOptions(){
    this.playerOptions = !this.playerOptions;
  }

  getData(){
    this.optionsList = [
      {
        itemName: 'Like',
        itemIcon: 'heart'
      },
      {
        itemName: 'Hide this song',
        itemIcon: 'heart'
      },
      {
        itemName: 'Add to playlist',
        itemIcon: 'heart'
      },
      {
        itemName: 'Connect friend',
        itemIcon: 'users'
      },
      {
        itemName: 'Play Video',
        itemIcon: 'users'
      },
      {
        itemName: 'lyrics',
        itemIcon: 'users'
      }
    ];
  }
  showserProf()
  {
  this.userProf=true
  }
  closeView(e:any)
  {
    if(e)
  this.userProf=false

  }
}
