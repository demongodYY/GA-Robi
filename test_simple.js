const { getRobiTestAveScore } = require('./lib/utils');
const { simpleOptimizeGeneList } = require('./lib/geneList');

function geneListRun(geneList) {
  const score = getRobiTestAveScore(geneList);
  console.log('GENE LIST:', geneList.join(''));
  console.log('SCORE:', score);
}

function testSimpleList() {
  const geneList = simpleOptimizeGeneList();
  geneListRun(geneList);
}


console.log('-------------run simple optimize geneList-----------')
testSimpleList();
