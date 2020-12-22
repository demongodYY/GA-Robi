const { randomGeneList } = require('./geneList');
const { getRandomIntNum, getRobiTestAveScore, calScores } = require('./utils');


class GA {

  constructor() {
    this.crowdNums = 200;
    this.genesCrowd = Array.from(Array(this.crowdNums), () => randomGeneList());
    this.currentCrwodScores = this.__getGenesScore();
    this.__showScore(this.currentCrwodScores);
    this.stopEvo = true;
  }
  __makeCrowdIteration() {
    const childrenGenesCrowd = [];
    for (let i = 0; i < this.crowdNums / 2; i++) {
      const [fIdx, mIdx] = this.__randomPickTwoGeneIndex(this.currentCrwodScores);
      // console.log('CHOOSED: ', fIdx, currentCrwodScores[fIdx], mIdx, currentCrwodScores[mIdx]);
      const [childGeneList1, childGeneList2] = this.__makeChildGeneList(this.genesCrowd[fIdx], this.genesCrowd[mIdx]);
      childrenGenesCrowd.push(childGeneList1);
      childrenGenesCrowd.push(childGeneList2);
    }
    this.genesCrowd = childrenGenesCrowd;
    this.currentCrwodScores = this.__getGenesScore();
  }

  __getGenesScore() {
    return this.genesCrowd.map(geneList => {
      return getRobiTestAveScore(geneList, 100);
    });
  }

  __randomPickTwoGeneIndex(crwodScores) {
    const result = [];
    let loopTimes = 0;
    while (true) {
      if (result.length >= 2) break;
      const randomBaseScore = getRandomIntNum(400 - Math.floor(loopTimes / 100), 500);
      const randomIndex = getRandomIntNum(0, 199);
      if (randomIndex === result[0]) continue;    //avoid choose self;
      loopTimes += 1;
      if (crwodScores[randomIndex] > randomBaseScore) {
        result.push(randomIndex)
      };
    }
    return result;
  }

  __makeChildGeneList(fGeneList, mGeneList) {
    const position = getRandomIntNum(0, 242);
    const child1 = fGeneList.slice(0, position).concat(mGeneList.slice(position));
    const child2 = mGeneList.slice(0, position).concat(fGeneList.slice(position));
    const mutatedChild1 = this.__geneMutate(child1);
    const mutatedChild2 = this.__geneMutate(child2);
    return [mutatedChild1, mutatedChild2];
  }

  __geneMutate(geneList) {
    return geneList.map(gene => {
      const randomNum = getRandomIntNum(0, 1000);
      if (randomNum < 1) {
        // console.log('mutated!!!!!!!!!!!!!');
        return getRandomIntNum(1, 6);
      }
      return gene;
    })
  }

  __showScore(scores) {
    // const maxScore = Math.max.apply(null, scores);
    // const minScore = Math.min.apply(null, scores);
    // const aveScore = (scores.reduce((sofar, score) => sofar + score, 0)) / scores.length;
    const [maxScore, minScore, aveScore] = calScores(scores)
    console.log('MAX SCORE: ', maxScore);
    console.log('MIN SCORE: ', minScore);
    console.log('AVE SCORE: ', aveScore);
  }

  getEvolvedGeneList(times) {
    for (let i = 0; i < times; i++) {
      console.log(`-----------------第 ${i + 1} 次迭代-------------------`);
      this.__makeCrowdIteration();
      this.__showScore(this.currentCrwodScores);
    }

    const finalScores = this.currentCrwodScores;
    const maxScore = Math.max.apply(null, finalScores);
    const maxIndex = finalScores.indexOf(maxScore);
    return this.genesCrowd[maxIndex];
  }

  stopAsyncEvolution() {
    this.stopEvo = true;
  }

  asyncGetEvolvedGeneList(times, stepCallback = () => { }) {
    let i = 0;
    let resolver;
    let rejector;
    this.stopEvo = false;
    const timer = setInterval(() => {
      this.__makeCrowdIteration();
      stepCallback(this.currentCrwodScores, i);
      i++;
      if (i >= times || this.stopEvo === true) {
        const finalScores = this.currentCrwodScores;
        const maxScore = Math.max.apply(null, finalScores);
        const maxIndex = finalScores.indexOf(maxScore);
        resolver(this.genesCrowd[maxIndex]);
        clearInterval(timer)
      }
    }, 50);

    return new Promise((resolve, reject) => {
      resolver = resolve;
      rejector = reject
    });

  }

}

module.exports = { GA };