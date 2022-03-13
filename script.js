'use strict'
// 1行目に記載している 'use strict' は削除しないでください

const letters = [
  "アイウエオ",
  "カキクケコ",
  "サシスセソ",
  "タチツテト",
  "ナニヌネノ",
  "ハヒフヘホ",
  "マミムメモ",
  "ヤユヨ",
  "ラリルレロ",
  "ワンー",
  "ガギグゲゴ",
  "ザジズゼゾ",
  "ダヂヅデド",
  "バビブベボ",
  "パピプペポ",
  "ァィゥェォ",
  "ャュョ",
  "ッ"];

const keyBase = document.querySelector('.keybase');
const keys = [];
letters.forEach(row => {
  const div = document.createElement('div');
  div.className = 'column';
  keyBase.appendChild(div);
  for (const char of row) {
    const span = document.createElement('span');
    span.textContent = char;
    span.id = char;
    span.addEventListener('click', clickLetter);
    div.appendChild(span);
    keys.push(span);
  }
});

const frontRows = [];
initializeAnswerBase(frontRows, document.querySelector('.answerfront'));
const backRows = [];
initializeAnswerBase(backRows, document.querySelector('.answerback'));
function initializeAnswerBase(rows, base) {
  for (let j = 0; j < 10; j++) {
    const answerRow = document.createElement('div');
    answerRow.className = 'answerRow';
    base.appendChild(answerRow);
    const row = [];
    rows.push(row);
    for (let i = 0; i < 5; i++) {
      const span = document.createElement('span');
      answerRow.appendChild(span);
      row.push(span);
    }
  }
}

if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
  let style = "<style>p{ font-size: 12px; }<style>";
  document.querySelector("head").insertAdjacentHTML("beforeend", style);
}

const deleteButton = document.querySelector('.delete');
deleteButton.addEventListener('click', deleteLast);

const checkButton = document.querySelector('.check');
checkButton.addEventListener('click', checkTheAnswer);

const nextButton = document.querySelector('.next');
nextButton.addEventListener('click', initialize);

const message = document.querySelector('.message');
const messageBase = document.querySelector('.messagebase');
let times;
let correctAnswer;
let answerWord;
let answerFrames;
let hints;
initialize();


function initialize() {
  messageBase.style.display = 'none';
  messageBase.style.opacity = '0';
  times = 0;
  answerFrames = [...frontRows[0], ...backRows[0]];
  answerWord = [];
  correctAnswer = allPokemon[Math.floor(Math.random() * allPokemon.length)];
  [...frontRows, ...backRows].forEach( row => row.forEach( (span, index) => {
    span.removeAttribute('style');
    span.textContent = "";
    span.classList.remove(...span.classList);
  } ) );
  backRows.forEach( row => row.forEach( span => span.className = "back" ) );
  keys.forEach( key => key.classList.remove(...key.classList) );
  hints = allPokemon;
  displayHints();
  setTimeout(() => [...frontRows, ...backRows].forEach( row => row.forEach( (span, index) =>
                    span.style.transitionDelay = `${index * 0.15}s` ) ), 1000);
}

function clickLetter() {
  if (answerWord.length > 4) {
    return;
  }
  displayAnswer( () => answerWord.push(this.textContent) )
}

function deleteLast() {
  displayAnswer( () => answerWord.pop() );
}

function displayAnswer(answerHandler) {
  if (messageBase.style.display === 'flex') {
    return;
  }
  answerHandler();
  answerFrames.forEach((frame, index) => frame.textContent = answerWord[index % 5] ? answerWord[index % 5] : "");
}

function checkTheAnswer() {
  if (answerWord.length < 5) {
    return;
  }
  if (messageBase.style.display === 'flex') {
    return;
  }
    
  answerFrames.forEach( (frame, index) => index < 5 ?
                       frame.style.transform = "rotateY(180deg)" :
                       frame.style.transform = "rotateY(0deg)" );

  const correct = [...correctAnswer];
  for (let i = 0; i < 5; i++) {
    if (correct[i] === answerWord[i]) {
      answerFrames[i + 5].className = "correct";
      document.getElementById(correct[i]).className = "correct";
      correct[i] = "?";
      hints = hints.filter(pokemonName => pokemonName[i] === answerWord[i]);
    }
  }
  if (answerWord.reduce((word, char) => word + char) === correctAnswer) {
    // 正解画面を出す。
    displayMessage("🎉せいかい🎉");
    return;
  }

  for (let i = 0; i < 5; i++) {
    if (answerFrames[i + 5].className === "correct") {
      continue;
    }
    
    const key = document.getElementById(answerWord[i]);
    if (correct.includes(answerWord[i])) {
      answerFrames[i].className = "included";
      answerFrames[i + 5].className = "included";
      correct[correct.indexOf(answerWord[i])] = "?";
      if (key.className !== "correct") {
        key.className = "included";
        hints = hints.filter( pokemonName => pokemonName.includes(answerWord[i])
                             && pokemonName[i] !== answerWord[i] );
      }
    } else {
      answerFrames[i].className = "incorrect";
      answerFrames[i + 5].className = "incorrect";
        if (key.className === "") {
        key.className = "incorrect";
        hints = hints.filter( pokemonName => !pokemonName.includes(answerWord[i]) );
      } else {
        hints = hints.filter( pokemonName => pokemonName[i] !== answerWord[i] );
      }
    }
  }
  
  answerWord = [];
  times++;
  if (times >= 10) {
    // ざんねん
    displayMessage(`ざんねん😢<br><br>せいかいは<br>${correctAnswer}<br>でした`);
    return;
  }
  answerFrames = [...frontRows[times], ...backRows[times]];
  displayHints();
}

function displayMessage(string) {
  messageBase.style.display = 'flex';
  setTimeout(() => messageBase.style.opacity = "1", 10)
  message.innerHTML = string;
}

function displayHints() {
  const hintBase = document.querySelector('.hintbase');
  while (hintBase.firstChild) {
    hintBase.removeChild(hintBase.firstChild);
  }
  hints.forEach(pokemon => {
    const pokeElement = document.createElement('p');
    pokeElement.textContent = pokemon;
    hintBase.appendChild(pokeElement);
  });
};
