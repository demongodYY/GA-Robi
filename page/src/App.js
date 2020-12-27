import './App.css';
import { useEffect, useState, useRef } from 'react';




import robiImg from '../public/Robi.png';
import * as R from 'ramda';

import { simpleOptimizeGeneList, randomGeneList } from '../../lib/geneList';
import { getRandomRect, calScores, getStrStatu, getPlainStatu, getPlainCommand } from '../../lib/utils';
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
    if (geneList.length !== 243) {
      alert('基因检测失败：请输入长度为 243 的正确基因序列');
      return;
    }
    const oRobi = new Robi(geneList, getRandomRect());
    setRobi(oRobi);
    alert('Robi 已成功设置新的基因序列');
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

  const handleRobiRunStep = () => {
    robi.__exeByGeneList();
    setRect(robi.rect);
    setX(robi.position[0]);
    setY(robi.position[1]);
    setScore(robi.score);
    setTimes(times + 1);
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

  const showScores = (scores, time = 0) => {
    const [maxScore, minScore, aveScore] = calScores(scores);
    addConsoleResult(`-----------------第 ${time} 次迭代-------------------`);
    addConsoleResult(`最高分：${maxScore}`);
    addConsoleResult(`最低分：${minScore}`);
    addConsoleResult(`平均分：${aveScore}`);
  }

  const getGAList = async () => {
    addConsoleResult(`开始用遗传算法生成基因序列（1000 次迭代）...`);
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

  const renderRobi = () => {
    return (
      <div className="game-container">
        <p className="game-desc">
          <b>游戏规则：</b>
          行动 200 步，成功清扫一处垃圾加 10 分，若在没有垃圾处执行清扫动作扣 1 分，撞墙（超出边界）扣 5 分。（总共 100 个格子，大约 50 个垃圾）
        </p>
        {robi ? <div className="game-wrapper">
          <h1>第 {times} 步，分数：{score}</h1>
          <div className='rect-wrapper'>
            {rect.map((row, yIndex) => {
              return <div className="rect-row" key={yIndex}>
                {row.map((unit, xIndex) => {
                  return (
                    <div className="rect-unit" key={xIndex}>
                      {unit === 2 ? 'X' : ''}
                      {xPosition === xIndex && yPosition === yIndex ? <img className="robi-img" src={robiImg} alt="role"></img> : null}
                    </div>)
                })}</div>
            })}
          </div>

          <button onClick={handleRobiRunStep}>单步运行</button>
          <button onClick={handleRobiRun}>运行</button>
          <button onClick={handleReset}>重置</button>
        </div> : '等待 Robi 的生成...'}
      </div>
    )
  }

  const renderCreateRobi = () => {

    const renderCommandLine = (title, command, head = false) => {
      return <p className={head ? 'head-command' : 'normal-command'}>
        <span className="command-title">{title}</span>
        <span className="command-content">{command}</span>
      </p>
    }

    return <div className="gene-wrapper">
      <textarea className="gene-input" placeholder="请填入长度为 243 的基因序列..." value={strGene} onChange={evt => {
        setStrGene(evt.target.value);
      }}></textarea>
      <div className="command">
        {renderCommandLine('上下左右中 (xxxxx)', '指令', true)}
        {strGene.split('').map((cmd, index) => {
          const strIndex = getStrStatu(index);
          const plainIndex = getPlainStatu(strIndex);
          const plainCmd = getPlainCommand(cmd);
          return renderCommandLine(`${plainIndex} (${strIndex})`, `${plainCmd} (${cmd})`);
        })}
      </div>
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
        }}>生成随机基因序列</button>
        <button onClick={() => {
          addConsoleResult(simpleOptimizeGeneList().join(''), '简单优化基因序列');
        }}>生成简单优化基因</button>
        <button onClick={getGAList}>开始遗传算法生成基因</button>
        <button onClick={stopGA}>停止遗传算法</button>
        <button onClick={clearResult}>清空结果栏</button>
      </div>
      <div className="console-result" ref={resultRef}></div>
    </div>
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
      {renderCreateRobi()}
      {renderRobi()}
    </div>
  );
}

export default App;
