const Robi = require('./Robi');
const { getRobiTestAveScore } = require('./utils');
const { simpleOptimizeGeneList } = require('./geneList');

function testGeneListRun() {
  const geneList = simpleOptimizeGeneList();
  const score = getRobiTestAveScore(geneList);
  return;
}


testGeneListRun();