const { getRobiTestAveScore } = require('./lib/utils');
const { GA } = require('./lib/GA');


function geneListRun(geneList) {
  const score = getRobiTestAveScore(geneList);
  console.log('GENE LIST:', geneList.join(''));
  console.log('SCORE:', score);
}

function testGaList() {
  const ga = new GA();
  const gaList = ga.getEvolvedGeneList(1000);
  geneListRun(gaList)
}





console.log('-------------test create GA geneList-----------')
testGaList();

