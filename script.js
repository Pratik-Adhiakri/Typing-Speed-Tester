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
