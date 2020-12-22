const { Robi } = require('./Robi')
// import Robi from './Robi';

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
  let sumScore = 0;
  for (let i = 0; i < times; i++) {
    const rect = getRandomRect();
    const robi = new Robi(geneList, rect);
    const score = robi.autoExe();
    sumScore += score;
  }
  const aveScore = Math.round(sumScore / times);
  // console.log('average score: ', aveScore);
  return aveScore;
}

function getRandomIntNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getStrStatu(numStatu) {
  return ('00000' + numStatu.toString(3)).slice(-5);
}




function calScores(scores) {
  const maxScore = Math.max.apply(null, scores);
  const minScore = Math.min.apply(null, scores);
  const aveScore = (scores.reduce((sofar, score) => sofar + score, 0)) / scores.length;
  return [maxScore, minScore, aveScore];
}



module.exports = {
  getRandomRect,
  getRobiTestAveScore,
  getRandomIntNum,
  getStrStatu,
  calScores,
}