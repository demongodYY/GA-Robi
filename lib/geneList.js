const { getRandomIntNum, getStrStatu } = require('./utils')


function randomGeneList() {
  const geneList = Array.from(new Array(243), () => getRandomIntNum(1, 6));
  return geneList;
}

function randomMoveGeneList() {
  return Array.from(new Array(243), () => 5);
}

function simpleOptimizeGeneList() {
  const geneList = randomMoveGeneList();
  return geneList.map((statu, index) => {
    const strIndex = getStrStatu(index);
    if (strIndex[4] === '2') {
      return 6;
    }
    else if (strIndex[0] === '0' || strIndex[1] === '2') {
      return 2;
    }
    else if (strIndex[1] === '0' || strIndex[0] === '2') {
      return 1;
    }
    else if (strIndex[2] === '0' || strIndex[3] === '2') {
      return 4;
    }
    else if (strIndex[3] === '0' || strIndex[2] === '2') {
      return 3;
    }
    else if (strIndex[4] !== '2' && statu === 6) {
      return 5;
    }
    else {
      return statu;
    }
  });
}

//上下左右中


module.exports = {
  randomGeneList,
  randomMoveGeneList,
  simpleOptimizeGeneList
}