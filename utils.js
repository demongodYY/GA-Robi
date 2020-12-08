const Robi = require('./Robi')

function getRandomRect() {
  const rect = new Array(10);
  for (let i = 0; i < 10; i++) {
    rect[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
      rect[i][j] = Math.round(Math.random()) + 1;
    }
  }
  return rect;
}

function getRobiTestAveScore(geneList, times = 1000) {
  console.log(`run Robi ${times} times...`)
  let sumScore = 0;
  for (let i = 0; i < 1000; i++) {
    const rect = getRandomRect();
    const robi = new Robi(geneList, rect);
    const score = robi.autoExe();
    sumScore += score;
  }
  const aveScore = Math.round(sumScore / 1000);
  console.log('average score: ', aveScore);
  return aveScore;
}


module.exports = {
  getRandomRect,
  getRobiTestAveScore
}