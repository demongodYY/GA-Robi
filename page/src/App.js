import './App.css';
import { useEffect, useState, useRef } from 'react';




import robiImg from '../public/Robi.png';
import * as R from 'ramda';

import { simpleOptimizeGeneList, randomGeneList } from '../../lib/geneList';
import { getRandomRect, calScores } from '../../lib/utils';
import { Robi } from '../../lib/Robi';
import { GA } from '../../lib/GA';


function App() {
  const [robi, setRobi] = useState(null);
  const [rect, setRect] = useState(getRandomRect());
  const [xPosition, setX] = useState(0);
  const [yPosition, setY] = useState(0);
  const [score, setScore] = useState(0);
  const [times, setTimes] = useState(0);
  const [strGene, setStrGene] = useState('');

  const resultRef = useRef();

  let ga = null;

  const createRobi = (geneList) => {
    const oRobi = new Robi(geneList, getRandomRect());
    setRobi(oRobi);
  }

  const handleRobiRun = () => {
    if (times !== 0) handleReset();
    setTimeout(() => robi.asyncAutoExe(200, 100, (score, rect, position, times) => {
      setRect(R.clone(rect));
      setX(position[0]);
      setY(position[1]);
      setScore(score);
      setTimes(times + 1);
    }), 200);
  }

  const handleReset = () => {
    const newRect = getRandomRect();
    robi.resetGame(newRect);
    setRect(robi.rect);
    setX(robi.position[0]);
    setY(robi.position[1]);
    setScore(robi.score);
    setTimes(0);
  }

  const renderRobi = () => {
    if (!robi) return <div className="game-wrapper"></div>
    return (
      <div className="game-wrapper">
        <h1>第 {times} 步，分数：{score}</h1>
        <div className='rect-wrapper'>
          {rect.map((row, yIndex) => {
            return <div className="rect-row" key={yIndex}>
              {row.map((unit, xIndex) => {
                return (
                  <div className="rect-unit" key={xIndex}>
                    {unit == 2 ? 'X' : ''}
                    {xPosition == xIndex && yPosition == yIndex ? <img className="robi-img" src={robiImg}></img> : null}
                  </div>)
              })}</div>
          })}
        </div>
        <button onClick={handleRobiRun}>运行</button>
        <button onClick={handleReset}>重置</button>
      </div>
    )
  }

  const renderCreateRobiHeader = () => {
    return <div className="gene-wrapper">
      <textarea className="gene-input" value={strGene} onChange={evt => {
        setStrGene(evt.target.value);
      }}></textarea>
      <button onClick={() => {
        const gene = strGene.split('').map(s => parseInt(s));
        createRobi(gene);
      }}>生成 Robi</button>
    </div>
  }

  const renderGeneConsole = () => {
    return <div className="console-wrapper">
      <div className="console-btns">
        <button onClick={() => {
          addConsoleResult(randomGeneList().join(''), '随机基因');
        }}>生成随机基因</button>
        <button onClick={() => {
          addConsoleResult(simpleOptimizeGeneList().join(''), '简单优化基因');
        }}>生成简单优化基因</button>
        <button onClick={getGAList}>开始遗传算法生成基因</button>
        <button onClick={stopGA}>停止遗传算法</button>
        <button onClick={clearResult}>清空结果栏</button>
      </div>
      <div className="console-result" ref={resultRef}></div>
    </div>
  }

  const showScores = (scores, time = 0) => {
    const [maxScore, minScore, aveScore] = calScores(scores);
    addConsoleResult(`-----------------第 ${time} 次迭代-------------------`);
    addConsoleResult(`最高分：${maxScore}`);
    addConsoleResult(`最低分：${minScore}`);
    addConsoleResult(`平均分：${aveScore}`);
  }

  const getGAList = async () => {
    addConsoleResult(`开始用遗传算法生成基因序列...`);
    ga = new GA();
    const initScores = ga.currentCrwodScores;
    showScores(initScores);
    const gaList = await ga.asyncGetEvolvedGeneList(1000, (scores, time) => {
      showScores(scores, time + 1);
    });
    addConsoleResult(gaList.join(''), '遗传算法基因');
  }

  const stopGA = () => {
    if (!ga) return;
    ga.stopAsyncEvolution();
  }

  const clearResult = () => {
    const resultWrapper = resultRef.current;
    resultWrapper.innerHTML = '';
  }

  const addConsoleResult = (content, title) => {
    const resultWrapper = resultRef.current;
    if (title) {
      const titleWrapper = document.createElement('h5');
      titleWrapper.appendChild(document.createTextNode(title));
      resultWrapper.appendChild(titleWrapper);
      titleWrapper.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
    }
    if (content) {
      const contentWrapper = document.createElement('p');
      contentWrapper.appendChild(document.createTextNode(content));
      resultWrapper.appendChild(contentWrapper);
      contentWrapper.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
    }

  }

  useEffect(() => {
    if (!robi) return;
    setRect(robi.rect);
    setX(robi.position[0]);
    setY(robi.position[1]);
    setScore(robi.score);
    setTimes(0);
  }, [robi]);



  return (
    <div className="App">
      {renderGeneConsole()}
      {renderCreateRobiHeader()}
      {renderRobi()}
    </div>
  );
}

export default App;
