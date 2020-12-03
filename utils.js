
function getRandomGeneList() {
  const geneList = Array.from(new Array(243), () => Math.floor(Math.random() * (6 - 0 + 1) + 0));
  return geneList;
}

function getAllRandomMoveGeneList() {
  return Array.from(new Array(243), () => 5);
}

function getRandomRect() {
  const rect = new Array(10);
  for (let i = 0; i < 10; i++) {
    rect[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
      rect[i][j] = Math.round(Math.random()) + 1;
    }
  }
  return rect;
}


module.exports = {
  getRandomGeneList,
  getAllRandomMoveGeneList,
  getRandomRect
}