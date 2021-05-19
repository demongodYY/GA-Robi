const { getRandomIntNum, getStrStatu } = require('./utils');

function randomGeneList() {
  const geneList = Array.from(new Array(243), () => getRandomIntNum(1, 6));
  return geneList;
}

function randomMoveGeneList() {
  return Array.from(new Array(243), () => 5);
}

// 如果位置 中 的情况为 圾，则将对应行动指令改为 清扫垃圾（6）
// 如果位置 上 的情况为 墙，或者位置 下 的情况为 圾，则将对应行动指令设为 向下移动（2）
// 如果位置 下 的情况为 墙，或者位置 上 的情况为 圾，则将对应行动指令设为 向上移动（1）
// 如果位置 左 的情况为 墙，或者位置 右 的情况为 圾，则将对应行动指令设为 向右移动（2）
// 如果位置 右 的情况为 墙，或者位置 左 的情况为 圾，则将对应行动指令设为 向左移动（2）
// 其他情况的行动指令都为 随机移动（5）
function simpleOptimizeGeneList() {
  const geneList = randomMoveGeneList();
  return geneList.map((statu, index) => {
    const strIndex = getStrStatu(index);
    if (strIndex[4] === '2') {
      // center grid is rubbish, should
      return 6;
    } else if (strIndex[0] === '0' || strIndex[1] === '2') {
      return 2;
    } else if (strIndex[1] === '0' || strIndex[0] === '2') {
      return 1;
    } else if (strIndex[2] === '0' || strIndex[3] === '2') {
      return 4;
    } else if (strIndex[3] === '0' || strIndex[2] === '2') {
      return 3;
    } else if (strIndex[4] !== '2' && statu === 6) {
      return 5;
    } else {
      return statu;
    }
  });
}

//上下左右中 01234
//不上下左右随扫  0123456

function customOptimizeGeneList() {
  const geneList = randomGeneList();
  return geneList.map((statu, index) => {
    const strIndex = getStrStatu(index);
    //custom optimize code here
    return statu;
  });
}

module.exports = {
  randomGeneList,
  randomMoveGeneList,
  simpleOptimizeGeneList,
  customOptimizeGeneList,
};
