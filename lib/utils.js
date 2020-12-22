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

function getPlainStatu(strStatu) {
  const table = {
    '0': '墙',
    '1': '空',
    '2': '圾'
  }
  return strStatu.split('').map((l) => table[l]).join('');
}

function getPlainCommand(strCommand) {
  const table = {
    '0': '原地不动',
    '1': '向上移动',
    '2': '向下移动',
    '3': '向左移动',
    '4': '向右移动',
    '5': '随机移动',
    '6': '清扫垃圾',
  }
  return table[strCommand];
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
  getPlainStatu,
  calScores,
  getPlainCommand
}