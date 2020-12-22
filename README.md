# 遗传算法
借鉴达尔文的进化论和孟德尔的遗传学说，在计算机中我们也可以设计出一些算法，通过适者生存的方式，帮助我们慢慢找出规则中优秀的“基因”，通过“遗传”地方式保留下来，从而找寻到一些问题的最优解。

## 游戏规则
假定有一个机器人叫做 Robi，它存在的世界是由一个 10x10 共100个的方格组成的围墙中。在这些方格中，会随机有50%的几率有一个垃圾。而 Robi 的任务就是尽可能多的捡起这些垃圾。

游戏的规则如下：
- Robi 的动作一共有 6 种：上移、下移、左移、右移、随机移动、清扫垃圾。
- Robi 每一步只能执行上述动作中的一种，一共可以走 200 步。

Robi 每次得分规则如下：
- 如果在有垃圾的地方进行了“清扫垃圾”的动作，就 `+10` 分，如果没在没有垃圾的地方“清扫垃圾”就 `-1` 分。
- 如果移动撞墙了，就 `-5` 分并弹回原地。
- 其他情况分数不变。

可以看出，在执行 `200` 步的情况下，最低分是 `-1000` 分（一直撞墙），最高分是 `500` 分（所有垃圾都捡到了）。

最后， Robi 可以看见上下左右以及当前总共 5 个格子的情况。情况分 3 种：有垃圾、空格子、墙。也就是说 Robi 每行动一步时所面临的情况有 `3^5 = 243`  种（简单起见，包括了脚底下也踩着墙这种不可能出现的情况）。

我们所要做的就是给这 243 种情况设定规则，让 Robi 能在游戏中得到**尽可能高**的分数。

### Robi 观察到的情况
按 `上、下、左、右、中` 的顺序来编码 Robi 在当前位置观察到的情况，在每个格子中可能有 3 种情况：
- `0` 代表墙（`墙`）
- `1` 代表空格子（`空`）
- `2` 代表有垃圾的格子（`圾`）

例如：`01012` 就代表了 `墙空墙空圾`，`00000` 代表了 `墙墙墙墙墙（不可能出现）`，`11111` 代表了 `空空空空空`，`22222` 代表了 `圾圾圾圾圾` 

### Robi 可以采取的行动
- `0` 原地不动（基本不用）
- `1` 向上移动
- `2` 向下移动
- `3` 向左移动
- `4` 向右移动
- `5` 随机移动
- `6` 清扫垃圾

### Robi 的行动基因
将 Robi 可能遇到的 243 种情况（`00000 ~ 22222`）通过 **三进制** 编码作为长度为 243 的数组的索引，并填上对应的行动，就构成了 Robi 的行动基因。

![image](https://user-images.githubusercontent.com/17036920/102896428-53209600-44a1-11eb-9423-2ceb5d2dba76.png)

## 目录结构

- `lib/Robi.js` Robi 的游戏运行
- `lib/GA.js` 遗传算法
- `lib/geneList.js` 生成的几种简单基因序列
- `lib/utils.js` 常用方法
- `data/ga_history.json` 已经用遗传算法生成出的基因序列
- `page 目录` 浏览器端的例子

## 运行 Robi 例子
### 浏览器运行
1. 访问 https://demongodyy.github.io/GA-Robi/
2. 生成想要的行动基因序列
3. 填入基因序列生成 Robi
4. 查看 Robi 运行情况

![image](https://user-images.githubusercontent.com/17036920/102896944-3769bf80-44a2-11eb-8e72-d049b0efaa82.png)

### 后台运行
在 `Node.js` 环境中运行 `test.js` 文件，会对比**简单优化序列** 和 **通过遗传算法 进行2000 次迭代进化出的序列** 各运行 1000 次游戏的平均分对比。并从头开始通过遗传算法迭代一个序列。

1. `cd 项目目录`
2. `node test.js`

![image](https://user-images.githubusercontent.com/17036920/102898230-2621b280-44a4-11eb-899e-fd87bee1f331.png)

## 基因生成算法
### 简单优化基因

1. 如果位置 `中` 的情况为 `圾`，则将对应行动指令改为 `清扫垃圾（6）`
2. 如果位置 `上` 的情况为 `墙`，或者位置 `下` 的情况为 `圾`，则将对应行动指令设为 `向下移动（2）`
3. 如果位置 `下` 的情况为 `墙`，或者位置 `上` 的情况为 `圾`，则将对应行动指令设为 `向上移动（1）`
4. 如果位置 `左` 的情况为 `墙`，或者位置 `右` 的情况为 `圾`，则将对应行动指令设为 `向右移动（2）`
5. 如果位置 `右` 的情况为 `墙`，或者位置 `左` 的情况为 `圾`，则将对应行动指令设为 `向左移动（2）`
6. 其他情况的行动指令都为 `随机移动（5）`

``` javascript
function simpleOptimizeGeneList() {
  const geneList = randomMoveGeneList();
  return geneList.map((statu, index) => {
    const strIndex = getStrStatu(index);
    if (strIndex[4] === '2') {
      return 6;
    }
    else if (strIndex[0] === '0' || strIndex[1] === '2') {
      return 2;
    }
    else if (strIndex[1] === '0' || strIndex[0] === '2') {
      return 1;
    }
    else if (strIndex[2] === '0' || strIndex[3] === '2') {
      return 4;
    }
    else if (strIndex[3] === '0' || strIndex[2] === '2') {
      return 3;
    }
    else if (strIndex[4] !== '2' && statu === 6) {
      return 5;
    }
    else {
      return statu;
    }
  });
}
```

### 遗传算法生成基因序列

1. 随机生成 200 个基因序列，放入基因序列池
2. 将基因序列池中的每条基因序列运行游戏 100 次求对应的平均分
3. 从基因序列池中随机选取两条基因序列，分数越高选中的概率越大
4. 从一个随机位置断开两条序列，将序列 A 的前半段和序列 B 的后半段拼接，将序列 B 的前半段与序列 A 的后半段拼接，生成两条新的序列
5. 有很小的几率选取两条序列上的几个位置进行变异（随机变成另外一个行动指令）
6. 将两条序列放入新的基因序列池
7. 回到第 `3` 步重复，直到新的基因序列池有 200 个基因序列。
8. 用新的基因序列池，回到第 `2` 步开始重复，迭代 1000 次
9. 从最新的基因序列池中选取平均分最高的那条。

> 注：迭代次数，基因序列池的大小可以自己更改，会影响最终成绩。

``` javascript
//每轮迭代生成新的基因序列池
  __makeCrowdIteration() {
    const childrenGenesCrowd = [];
    for (let i = 0; i < this.crowdNums / 2; i++) {
      const [fIdx, mIdx] = this.__randomPickTwoGeneIndex(this.currentCrwodScores);
      // console.log('CHOOSED: ', fIdx, currentCrwodScores[fIdx], mIdx, currentCrwodScores[mIdx]);
      const [childGeneList1, childGeneList2] = this.__makeChildGeneList(this.genesCrowd[fIdx], this.genesCrowd[mIdx]);
      childrenGenesCrowd.push(childGeneList1);
      childrenGenesCrowd.push(childGeneList2);
    }
    this.genesCrowd = childrenGenesCrowd;
    this.currentCrwodScores = this.__getGenesScore();
  }
```

```javascript
//生成子序列
  __makeChildGeneList(fGeneList, mGeneList) {
    const position = getRandomIntNum(0, 242);
    const child1 = fGeneList.slice(0, position).concat(mGeneList.slice(position));
    const child2 = mGeneList.slice(0, position).concat(fGeneList.slice(position));
    const mutatedChild1 = this.__geneMutate(child1);
    const mutatedChild2 = this.__geneMutate(child2);
    return [mutatedChild1, mutatedChild2];
  }
  
//变异函数
  __geneMutate(geneList) {
    return geneList.map(gene => {
      const randomNum = getRandomIntNum(0, 1000);
      if (randomNum < 1) {
        return getRandomIntNum(1, 6);
      }
      return gene;
    })
  }
```


#### 迭代分数对比
![image](https://user-images.githubusercontent.com/17036920/102899250-9aa92100-44a5-11eb-8642-e726f5ad9b6c.png)

![image](https://user-images.githubusercontent.com/17036920/102899263-9da41180-44a5-11eb-893d-6c181eeae555.png)

![image](https://user-images.githubusercontent.com/17036920/102899270-a09f0200-44a5-11eb-8356-44f2ce97bb76.png)

![image](https://user-images.githubusercontent.com/17036920/102899275-a268c580-44a5-11eb-9648-91c74c991807.png)

![image](https://user-images.githubusercontent.com/17036920/102899396-c88e6580-44a5-11eb-8b4d-349ab863e60f.png)
