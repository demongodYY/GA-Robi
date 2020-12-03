class Robi {
  rect = new Array(10);
  position = [0, 0];
  score = 0;
  genList = new Array(243);
  constructor(genList = [], rect = [[]]) {
    this.rect = rect;
    this.genList = genList;
  }

  __move(dir, step) {
    this.position[dir] += step;
    const [x, y] = this.position;
    if (this.rect[y] === undefined || this.rect[y][x] === undefined) {
      this.position[dir] += -step;
      this.score -= 5;
    }
  }

  moveUp() {
    this.__move(1, -1);
  }


  moveDown() {
    this.__move(1, 1);
  }

  moveLeft() {
    this.__move(0, -1);
  }

  moveRight() {
    this.__move(0, 1);
  }

  moveRandom() {
    const dir = Math.round(Math.random()); // 0 or 1
    const step = Math.round(Math.random()) === 0 ? -1 : 1;  // -1 or 1
    this.__move(dir, step);
  }

  stay() {
    return;
  }

  clearItem() {
    const [x, y] = this.position;
    if (this.rect[y][x] === 2) {
      this.rect[y][x] = 1;
      this.score += 10;
    } else {
      this.score -= 1;
    }
  }

  exeCommand(command) {
    switch (command) {
      case 0:
        this.stay();
        break;
      case 1:
        this.moveUp();
        break;
      case 2:
        this.moveDown();
        break;
      case 3:
        this.moveLeft();
        break;
      case 4:
        this.moveRight();
        break;
      case 5:
        this.moveRandom();
        break;
      case 6:
        this.clearItem();
        break;
    }
  }

  detectPosition() {
    const getPositionStatu = (y, x) => {
      return this.rect[y] === undefined ? 0 : (this.rect[y][x] || 0);
    }
    const [x, y] = this.position;
    const upStatu = getPositionStatu(y - 1, x);
    const downStatu = getPositionStatu(y + 1, x);
    const leftStatu = getPositionStatu(y, x - 1);
    const rightStatu = getPositionStatu(y, x + 1);
    const middleStatu = getPositionStatu(y, x);
    const positionStatu = [upStatu, downStatu, leftStatu, rightStatu, middleStatu].join('');
    return positionStatu;
  }

  exeByGeneList() {
    const positionStatu = this.detectPosition();
    const numPositionStatu = parseInt(positionStatu, 3);
    const command = this.genList[numPositionStatu];
    const debugExeCommandFunc = (command) => {
      console.log('before position:', this.position);
      console.log('currentStatu: ', this.detectPosition());
      console.log(`exe command ${command}`);
      this.exeCommand(command);
      console.log('after position:', this.position);
      console.log('score: ', this.score);
      console.log('----------------------');
    }

    // debugExeCommandFunc(command);
    this.exeCommand(command);
  }

  autoExe(times = 0) {
    for (let i = 0; i < times; i++) {
      this.exeByGeneList();
    }
    console.log(`FINAL SCORE: ${this.score}`);
  }
}

module.exports = Robi;