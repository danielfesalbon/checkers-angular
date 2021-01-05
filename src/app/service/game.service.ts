import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  col = ['1', '2', '3', '4', '5', '6', '7', '8'];
  tiles = [];


  gameStart() {
    let i = 0, x = 0, p1 = 0, p2 = 0;
    for (let r in this.row) {
      x = x + 1;
      let y = 0;
      for (let c in this.col) {
        i = i + 1, y = y + 1;
        if (i <= 24) {
          if ((this.odd(x) && !this.odd(y)) || (!this.odd(x) && this.odd(y))) {
            p2 = p2 + 1;//player 2
            let tile = document.getElementById(this.row[r] + this.col[c]);
            tile.appendChild(this.createKnight("P2", p2, r, c, 'black', 'whitesmoke'));
          }
        }
        if (i >= 41) {
          if ((this.odd(x) && !this.odd(y)) || (!this.odd(x) && this.odd(y))) {
            p1 = p1 + 1; //player 1
            let tile = document.getElementById(this.row[r] + this.col[c]);
            tile.appendChild(this.createKnight("P1", p1, r, c, 'white', 'black'));
          }
        }
      }
    }
    this.coloredboard();
    let board = document.getElementById('board');
    board.style.boxShadow = '0px 0px 15px 5px rgba(255, 255, 255, 0.2), 0px 0px 15px 5px rgba(255, 255, 255, 0.19)';
  }

  odd(num) {
    return num % 2;
  }

  createKnight(player, p, r, c, color, bg): HTMLElement {
    let knight: HTMLElement = <HTMLElement>document.createElement("div");
    knight.id = player + "-" + p.toString();
    knight.style.color = color;
    knight.style.backgroundColor = bg;
    knight.style.width = '30px';
    knight.style.height = '30px';
    knight.style.borderRadius = '50%';
    knight.style.cursor = 'pointer';
    knight.style.fontSize = '18px';
    knight.style.textAlign = 'center';
    knight.classList.add(this.row[r] + this.col[c]);
    knight.classList.add(player);
    knight.addEventListener("click", () => { this.move(knight, player); });
    return knight;
  }



  coloredboard() {
    let i = 0, x = 0;
    for (let r in this.row) {
      x = x + 1;
      let y = 0;
      for (let c in this.col) {
        i = i + 1, y = y + 1;
        let tile = <HTMLElement>document.getElementById(this.row[r] + this.col[c]);
        tile.style.paddingTop = '9px';
        tile.style.backgroundColor = 'rgb(180,136,99)';
        if ((this.odd(x) && !this.odd(y)) || (!this.odd(x) && this.odd(y))) {
          tile.style.paddingTop = '9px';
          tile.style.backgroundColor = 'rgb(240,218,181)';
        }
      }
    }
  }


  move(element: HTMLElement, player) {
    let elid = element.id, pos: any;
    if (element.classList[0] != player) {
      pos = element.classList[0];
    } else {
      pos = element.classList[1]
    }
    sessionStorage.setItem('knight', elid);
    sessionStorage.setItem('curpos', pos);
    sessionStorage.setItem('player', player);
    this.checkMoves();
  }



  selectTile(event) {
    let tile = document.getElementById(event.path[0].id);
    if (tile.id.split("-")[0] != "P1" && tile.id.split("-")[0] != "P2") {
      let moves: any[] = [];
      moves = JSON.parse(sessionStorage.getItem('moves'));
      let tileid = moves.find(m => { return m == tile.id });
      if (tileid != undefined) {
        let knight: HTMLElement = <HTMLElement>document.getElementById(sessionStorage.getItem('knight'));
        let currentpos = document.getElementById(knight.classList[0]);
        let nextpos = document.getElementById(tileid);
        if (!this.haveKnight(nextpos)) {
          if (knight.classList[0] != "P1" && knight.classList[0] != "P2") {
            currentpos = document.getElementById(knight.classList[0]);
            knight.classList.remove(knight.classList[0]);
          } else {
            currentpos = document.getElementById(knight.classList[1]);
            knight.classList.remove(knight.classList[1]);
          }
          currentpos.removeChild(knight);
          knight.classList.add(tileid);
          nextpos.appendChild(knight);
          this.checkEnemy(currentpos, nextpos);
          this.checkIfKing(knight, tileid);
        }
      }
    }
  }

  checkEnemy(from: HTMLElement, to: HTMLElement) {
    let Xs = this.col.slice(this.col.indexOf(from.id.split("")[1]), this.col.indexOf(to.id.split("")[1]));
    let Ys = this.row.slice(this.row.indexOf(from.id.split("")[0]), this.row.indexOf(to.id.split("")[0]));
    if (from.id.split("")[1] > to.id.split("")[1]) {
      Xs = this.col.slice(this.col.indexOf(to.id.split("")[1]), this.col.indexOf(from.id.split("")[1]));
    }
    if (from.id.split("")[0] > to.id.split("")[0]) {
      Ys = this.row.slice(this.row.indexOf(to.id.split("")[0]), this.row.indexOf(from.id.split("")[0]));
    }
    Xs.shift(), Ys.shift(), Ys.reverse();
    let paths: any[] = [];
    if (Ys.length == Xs.length) {
      for (let i = 0; i < Ys.length; i++) {
        paths.push(Ys[i] + Xs[i]);
      }
    }
    let enemy = sessionStorage.getItem('player') == "P1" ? "P2" : "P1";
    let enemies = document.getElementsByClassName(enemy);
    for (let path of paths) {
      for (let knights in enemies) {
        if (enemies[knights].classList != undefined) {
          if (enemies[knights].classList.contains(path)) {
            document.getElementById(path).removeChild(enemies[knights]);
          }
        }
      }
    }
  }


  haveKnight(element: Element): boolean {
    return (element.innerHTML != "");
  }

  checkMoves() {
    let curpos = sessionStorage.getItem('curpos');
    let moves: any[] = [];
    let cury = this.row[this.row.indexOf(curpos.split("")[0])];
    let curx = this.col[this.col.indexOf(curpos.split("")[1])];
    let y1index = this.row.indexOf(cury), y2index = this.row.indexOf(cury);
    for (let i = +curx; i <= this.col.length; i++) {
      y1index = y1index - 1, y2index = y2index + 1;
      if (this.row[y1index] != undefined && this.col[i] != undefined && this.row[y1index] != null && this.col[i] != null) {
        moves.push(this.row[y1index] + this.col[i]);//upright moves
      }
      if (this.row[y2index] != undefined && this.col[i] != undefined && this.row[y2index] != null && this.col[i] != null) {
        moves.push(this.row[y2index] + this.col[i]);//downright moves
      }
    }
    y1index = this.row.indexOf(cury), y2index = this.row.indexOf(cury);
    for (let j = (+curx - 1); j >= 1; j--) {
      y1index = y1index + 1, y2index = y2index - 1;
      if (this.row[y2index] != undefined && this.col[j - 1] != undefined && this.row[y2index] != null && this.col[j - 1] != null) {
        moves.push(this.row[y2index] + this.col[j - 1]);//upleft moves
      }
      if (this.row[y1index] != undefined && this.col[j - 1] != undefined && this.row[y1index] != null && this.col[j - 1] != null) {
        moves.push(this.row[y1index] + this.col[j - 1]);//downleft moves
      }
    }
    sessionStorage.setItem('moves', JSON.stringify(moves));
  }


  checkIfKing(element: HTMLElement, pos) {
    if (element.classList.contains("P1")) {
      if (pos.split("")[0] == "A") {
        element.innerHTML = "X";
      }
    } else {
      if (pos.split("")[0] == "H") {
        element.innerHTML = "X";
      }
    }
  }

}
