const { getRobiTestAveScore } = require('./lib/utils');

function geneListRun(geneList) {
  const score = getRobiTestAveScore(geneList);
  console.log('GENE LIST:', geneList.join(''));
  console.log('SCORE:', score);
}

function testMadeGaList() {
  const strGeneList = require('./data/ga_history.json')['2000'][0];
  const geneList = strGeneList.split('').map(t => parseInt(t));
  geneListRun(geneList);

  // console.log('-----------------------------')
  // console.log(geneList[parseInt('21111', 3)]);
  // console.log(geneList[parseInt('12111', 3)]);
  // console.log(geneList[parseInt('11211', 3)]);
  // console.log(geneList[parseInt('11121', 3)]);
  // console.log(geneList[parseInt('11112', 3)]);
}



console.log('-------------run made GA geneList-----------')
testMadeGaList();
