'use strict'
// 1行目に記載している 'use strict' は削除しないでください

const letters = ["アイウエオ",
                 "カキクケコ",
                 "サシスセソ",
                 "タチツテト",
                 "ナニヌネノ",
                 "ハヒフヘホ",
                 "マミムメモ",
                 "ヤユヨ",
                 "ラリルレロ",
                 "ワンー",
                 "ァィゥェォ",
                 "ガギグゲゴ",
                 "ザジズゼゾ",
                 "ダヂヅデド",
                 "ッ",
                 "バビブベボ",
                 "パピプペポ",
                 "ャュョ"];

const base = document.querySelector('.keybase');
const keys = [];
for (const letter of letters) {
    const div = document.createElement('div');
    div.className = 'column';
    base.appendChild(div);
    for (const char of letter) {
        const span = document.createElement('span');
        span.textContent = char;
        span.id = char;
        span.addEventListener('click', clickLetter);
        div.appendChild(span);
        keys.push(span);
    }
}

const answerBase = document.querySelector(".answerbase");
for (let j = 0; j < 10; j++) {
    const answerRow = document.createElement('div');
    answerRow.className = 'answerRow';
    answerBase.appendChild(answerRow);
    for (let i = 0; i < 5; i++) {
        const span = document.createElement('span');
        answerRow.appendChild(span);
    }
}

const deleteButton = document.querySelector('.delete');
deleteButton.addEventListener('click', deleteLast);

const checkButton = document.querySelector('.check');
checkButton.addEventListener('click', checkTheAnswer);

const messageBase = document.querySelector('.messagebase');
const message = document.querySelector('.message');
const nextButton = document.querySelector('.next');
nextButton.addEventListener('click', next);


let times = 0;
let correctAnswer = allPokemon[Math.floor(Math.random() * allPokemon.length)];
let answerWord = "";
const answerRows = document.querySelectorAll('.answerRow');

function clickLetter() {
  console.log('click');
  if (answerWord.length > 4) {
    return;
  }
  answerWord += this.textContent;
  displayAnswer();
}

function deleteLast() {
  console.log('delete');
  if (answerWord.length === 0) {
    return;
  }
  answerWord = answerWord.slice(0, -1);
  displayAnswer();
}

function displayAnswer() {
  const answerFrames = answerRows[times].children;
  for (let i = 0; i < 5; i++) {
    answerFrames[i].textContent = answerWord[i] ? answerWord[i] : "";
  }
}

function checkTheAnswer() {
  console.log('check');
  if (answerWord.length < 5) {
    return;
  }
  
  const answerRow = answerRows[times].children;
  let correct = correctAnswer;
  for (let i = 0; i < 5; i++) {
      if (correct[i] === answerWord[i]) {
          answerRow[i].className = "correct";
          document.getElementById(correct[i]).className = "correct";
          correct = correct.slice(0, i) + "?" + correct.slice(i + 1, correct.length);
      }
  }
  if (answerWord === correctAnswer) {
      // 正解画面を出す。
      messageBase.style.display = 'flex';
      message.textContent = "🎊せいかい🎊";
  }
  for (let i = 0; i < 5; i++) {
      let included = false
      const key = document.getElementById(answerWord[i]);
      for (let j = 0; j < 5; j++) {
          if (included) {
             // 何もしない
          } else if (answerWord[i] === correct[j]) {
              answerRow[i].className = "included";
              if (key.className !== "correct") {
                  key.className = "included";
              }
              correct = correct.slice(0, j) + "?" + correct.slice(j + 1, correct.length);
              included = true;
          }
      }
      if (!included && answerRow[i].className !== "correct") {
          answerRow[i].className = "incorrect";
          if (key.className !== "correct") {
              key.className = "incorrect";
          }
      }
  }
  answerWord = "";
  times++;
    
    if (times >= 10) {
        // ざんねん
        messageBase.style.display = 'flex';
        message.innerHTML = `ざんねん😢<br><br>せいかいは<br>${correctAnswer}<br>でした`;
    }
}

function next() {
    messageBase.style.display = 'none';
    times = 0;
    answerWord = "";
    correctAnswer = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    for (const row of answerRows) {
        for (const span of row.children) {
            span.textContent = "";
            span.classList.remove(...span.classList);
        }
    }
    for (const key of keys) {
        key.classList.remove(...key.classList);
    }
    console.log(correctAnswer);
}

console.log(correctAnswer);
