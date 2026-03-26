//finally after ages i am not doing css 
const wordpool=[

];//laterrr
const paragraphtemplates=[

];//later
let currentText = "";
let charElements= [];
let currentIdx= 0;
let typedChars=0;
let mistakeCount = 0;
let testrunning =false;
let testfinished=false;
let timerInterval=null;
let timerunning=30;
let totalTime=30;
let wpmHistory= [];
let runHistory=[];
let lastWpmUpdate= 0;
let smoothedWpm=0;
let totalKeystrokes= 0;
let correctKeystrokes=0;
let wordsCompleted=0;
let wordBoundaries=[];
let currentWordIdx= 0;
let showWordBar= true;
let capsLockOn= false;
//well well more incoming brother
const textDisplay= document.getElementById('textDisplay');
const hiddenInput= document.getElementById('hiddenInput');
const wpmDisplay= document.getElementById('wpmDisplay');
const accuracyDisplay= document.getElementById('accuracyDisplay');
const mistakesDisplay= document.getElementById('mistakesDisplay');
const timerDisplay= document.getElementById('timerDisplay');
const progressBar= document.getElementById('progressBar');
const typingContainer= document.getElementById('typingContainer');
const historyList = document.getElementById('historyList');
const resultsOverlay = document.getElementById('resultsOverlay');
const wordCountBar= document.getElementById('wordCountBar');
const capIndicator = document.getElementById('capIndicator');
const completeBar= document.getElementById('completeBar');
//finally now the real coding
function buildworldboundaries(text){
    wordBoundaries=[];
    let inWord = false;
    let wordStart=0;
    for(let i=0;i<text.length;i++){
        if (text[i]!== ' ' && !inWord) {
      inWord = true;
      wordStart = i;
    } else if (text[i] === ' ' && inWord) {
      wordBoundaries.push({ start: wordStart, end: i });
      inWord = false;
       }
    }
    if(inWord){
        wordBoundaries.push({
            start:wordStart,
            end:text.length
        });
    }
}
function generateText(){
    let baseIdx= Math.floor(Math.random()*paragraphtemplates.length);
    let base= paragraphtemplates[baseIdx];
    let extraWords= [];
    let needed= Math.max(0,80-base.split(' ').length);
    for(let i=0;i<needed;i++){
        extrayWords.push(wordpool[Math.floor(Math.random()*wordpool.length)]);
    }
    let allWords= base.spilit(' ').concat((extraWords));
    let result= allWords.join(' ');
    return result;
}
function renderText(text){
    textDisplay.innerHTML = '';
    charElements= [];
    for(let i=0;i<text.length;i++){
    let span = document.createElement('span');
    span.classList.add('char','pending');
    if(text[i]===' '){
        span.innerHTML='&nbsp';
        span.dataset.isSpace='true'; 
    }else{
        span.textContent = text[i];
    }
    textDisplay.appendChild(span);
    charElements.push(span);
}
if(charElements.length>0){
    charElements[0].classList.remove('pending');
    charElements[0].classList.add('current');
}
}
function buildWordBar(text){
    wordCountBar.innerHTML= '';
    let words= text.split(' ');
    words.forEach((w,i)=>{
        let pip =document.createElement('div');
        pip.classList.add('wc-pip');
        if(i===0)pip.classList.add('current-word');
        wordCountBar.appendChild(pip);
    });
}
function updateWordBar(){
    let pips = wordCountBar.querySelectorAll('.wc-pip');
    pips.forEach((pip,i)=>{
        pip.classList.remove('current-word');
        if(i<currentWordIdx)pip.classList.add('done');
        else if(i===currentWordIdx)pip.classList.add('current-word');
    });
}
