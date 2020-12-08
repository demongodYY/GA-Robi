const { getRobiTestAveScore } = require('./utils');
const { simpleOptimizeGeneList } = require('./geneList');
const GA = require('./GA');

function testGeneListRun() {
  const geneList = simpleOptimizeGeneList();
  const score = getRobiTestAveScore(geneList);
  console.log('GENE LIST:', geneList.join(''));
  console.log('SCORE:', score);

  return;
}

function testGaList() {
  const ga = new GA();
  const gaList = ga.getEvolvedGeneList(2000);
  console.log('GENE LIST:', gaList.join(''));
  const score = getRobiTestAveScore(gaList);
  console.log('SCORE:', score);
}

function testMadeGaList() {
  const strGaList = require('./ga_history.json')['2000'][0];
  const gaList = strGaList
    .split('')
    .map(t => parseInt(t));
  const score = getRobiTestAveScore(gaList);
  console.log('GENE LIST:', strGaList);
  console.log('SCORE:', score);

  // console.log('-----------------------------')
  // console.log(gaList[parseInt('21111', 3)]);
  // console.log(gaList[parseInt('12111', 3)]);
  // console.log(gaList[parseInt('11211', 3)]);
  // console.log(gaList[parseInt('11121', 3)]);
  // console.log(gaList[parseInt('11112', 3)]);
}


// testGaList();

console.log('-------------run simple optimize geneList-----------')
testGeneListRun();

console.log('-------------run GA geneList-----------')
testMadeGaList();