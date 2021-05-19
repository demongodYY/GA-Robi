const { getRobiTestAveScore } = require('./lib/utils');
const { randomGeneList } = require('./lib/geneList');

function geneListRun(geneList) {
  const score = getRobiTestAveScore(geneList);
  console.log('GENE LIST:', geneList.join(''));
  console.log('SCORE:', score);
}

function testSimpleList() {
  const geneList = randomGeneList();
  geneListRun(geneList);
}

console.log('-------------run random geneList-----------');
testSimpleList();
