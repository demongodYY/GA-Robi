const { getRobiTestAveScore } = require('./lib/utils');
const { customOptimizeGeneList } = require('./lib/geneList');

function geneListRun(geneList) {
  const score = getRobiTestAveScore(geneList);
  console.log('GENE LIST:', geneList.join(''));
  console.log('SCORE:', score);
}

function testSimpleList() {
  const geneList = customOptimizeGeneList();
  geneListRun(geneList);
}

console.log('-------------run custom optimize geneList-----------');
testSimpleList();
