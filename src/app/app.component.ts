import { Component, OnInit } from '@angular/core';
import { GameService } from './service/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(private service: GameService) {
  }


  row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  col = ['1', '2', '3', '4', '5', '6', '7', '8'];
  tiles = [];
  turn: string
  begin: boolean;

  ngOnInit(): void {
    this.begin = false;
    this.turn = "CLICK TO START";
  }

  selectTile(event) {
    this.service.selectTile(event);
    this.isend();
  }

  init() {
    this.service.gameStart();
    this.begin = true;
    this.turn = "MAY THE BEST CHECKER PLAYER WINS!";
  }

  reload() {
    location.reload();
  }

  isend() {
    let playerone = document.getElementsByClassName("P1");
    let playertwo = document.getElementsByClassName("P2");
    if (playerone.length <= 0) {
      this.turn = "WHITE WINS!";
    }
    if (playertwo.length <= 0) {
      this.turn = "BLACK WINS!";
    }
  }

}
