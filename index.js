const Robi = require('./Robi');
const { getRandomGeneList, getAllRandomMoveGeneList, getRandomRect } = require('./utils');
const { simpleOptimizeGeneList } = require('./optimize');

function testGeneListRun() {
  const rect = getRandomRect();
  console.log('GAME RECT: ', rect.map(row => row.join(',')));
  const geneList = getRandomGeneList();
  const newGeneList = simpleOptimizeGeneList(geneList);
  console.log('GENE LIST: ', newGeneList.toString());
  const robi = new Robi(newGeneList, rect);
  robi.autoExe(100);
  console.log('GENE LIST: ', geneList.toString());
  const robi2 = new Robi(geneList, rect);
  robi2.autoExe(100);
}

testGeneListRun();