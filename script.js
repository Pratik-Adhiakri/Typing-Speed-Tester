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
//lets just not stop
function findcurrentWordIdx(charIdx){
    for(let i=0;i<wordBoundaries.length;i++){
        if(charIdx>=wordBoundaries[i].start &&charIdx<wordBoundaries[i].end){
            return i;
        }
    }
    if(wordBoundaries.length>0&&charIdx>=wordBoundaries[wordBoundaries.length-1].end){
        return wordBoundaries.length;
    }
    return 0;
}
function starttimer(){
    if(timerInterval)clearInterval(timerInterval);
    timerInterval= setInterval(function(){
        if(!testrunning){
            clearInterval(timerInterval);
            return;
        }
        timeRemaining--;
        timerDisplay.textContent =timeRemaining;
        let progress =((totalTime-timeRemaining)/totalTime)*100;
        progressBar.style.width=progress+'%';
        let now=Date.now();
        if(now-lastWpmUpdate>800){
            updateLiveWpm();
            lastWpmUpdate=now;
        }
        if(timeRemaining<=0){
            clearInterval(timerInterval);
            finishTest();
        }
    },1000);
}
function getAccuracyMulti(){
    if(totalKeystrokes===0)return 1.00;
    return correctKeystrokes/totalKeystrokes;
}
function calcWpm(wordsDone){
    let multiplier= 60/totalTime;
    let accMultiplier= getAccuracyMulti();
    return Math.round(wordsDone*multiplier*accMultiplier); 
}
function updateLiveWpm(){
    if(!testrunning)return;
    let elapsed =totalTime-timeRemaining;
    if(elapsed<1)return;
    let displayWpm =calcWpm(wordsCompleted);
    wpmDisplay.textContent =displayWpm;
    let prev= parseInt(wpmDisplay.dataset.lastVal||'0');
    if(Math.abs(displayWpm-prev)>2){
        wpmDisplay.classList.remove('wpm-flash');
        void wpmDisplay.offsetWidth;
        wpmDisplay.classList.add('wpm-flash');
        wpmDisplay.dataset.lastVal= displayWpm;
    }
}
function updateAccuracy(){
    if(totalKeystrokes===0){
        accuracyDisplay.textContent='--';
        return;
    }
    let acc= Math.round((correctKeystrokes/totalKeystrokes)*100);
    accuracyDisplay.textContent=acc +'%';
}
function handleKeyInput(e){
    if(testfinished)return;
    if(e.key==='Tab'){
        e.preventDefault();
        resetTest(false);
        return;
    }
    if(e.key==='Escape'){
        e.preventDefault();
        resetTest(false);
        return;
    }
    if(e.key==='CapsLock'){
        capsLockOn= e.getModifierState&&e.getModifierState('CapsLock');
        if(capsLockOn){
          capIndicator.classList.add('visible');   
        }else{
            capIndicator.classList.remove('visible');
        }
        return;
    }
    if(e.ctrlKey||e.altKey||e.metaKey)return;
    if(!testrunning&&e.key.length===1){
        testrunning= true;
        typingContainer.classList.add('running');
        starttimer();
        lastWpmUpdate= Date.now();
    }
    if(!testrunning&&e.key!=='Backspace')return;
    if(e.key==='Backspace'){
        handleBackspace();
        return;
    }
    if(e.key.length!==1)return;
    if(currentIdx>=currentIdx.length)return;
    let expectedChar= currentText[currentIdx];
    let typedChars=e.key;
    totalKeystrokes++;
    typedChars++; 
    charElements[currentIdx].classList.remove('current');
    if(typedChars===expectedChar){
        charElements[currentIdx].classList.add('correct');
        correctKeystrokes++;
        if(expectedChar===' '){
            wordsCompleted++;
            currentWordIdx++;
            updateWordBar();
            updateLiveWpm();
        }
    }else{
        charElements[currentIdx].classList.add('incorrect');
        mistakeCount++;
        mistakesDisplay.textContent= mistakeCount;
        typingContainer.classList.add('test-error');
        setTimeout(function() {
            typingContainer.classList.remove('test-error');
        }, 300);
        updateLiveWpm();
    }
    currentIdx++;
    if(currentIdx<charElements.length){
        charElements[currentIdx+1].classList.remove('current');
        charElements[currentIdx+1].classList.add('pending');
    }
    typedChars=Math.max(0,typedChars-1);
}
function finishTest(){
    if(testfinished)return;
    testfinished=true;
    testrunning=false;
    clearInterval(timerInterval);
    let elapsed = totalTime-timeRemaining;
    if(elapsed<1)elapsed=1;
    let totalWordsForCalc= wordsCompleted;
    if(currentIdx>0&&currentText[currentIdx-1]!==' '){
        totalWordsForCalc++;
    }
    let finalWpm =Math.round(totalWordsForCalc*(60/totalTime)*getAccuracyMulti());
    let finalAccuracy= totalKeystrokes>0 ? Math.round((correctKeystrokes/totalKeystrokes)*100) : 0;
    wpmDisplay.textContent =finalWpm;
    accuracyDisplay.textContent=finalAccuracy+'%';
    timerDisplay.textContent='0';
    progressBar.style.width='100%';
    completeBar.classList.add('show');
    saveToHistory(finalWpm,finalAccuracy.mistakeCount,typedChars,elapsed);
    setTimeout(function(){
        showResults(finalWpm,finalAccuracy,mistakeCount,typedChars);
    },500);
}
//launch time
function showResults(wpm,acc,mistakes,chars){
    document.getElementById('resultWpm').textContent=wpm;
    document.getElementById('resultAccuracy').textContent=acc+'%';
    document.getElementById('resultMistakes').textContent= mistakes;
    document.getElementById('resultChars').textContent= chars;
    let ratingText= getRatingText(wpm,acc);
    document.getElementById('resultsRating').textContent= ratingText;
    document.getElementById('resultsRating').textContent=ratingText;
    resultsOverlay.classList.add('visible');
}
function getRatingText(wpm,acc){
    if(wpm>=120&&acc>=98)return "WTF you absolutely cooked good job!";
    if(wpm>=100&&acc>=96)return "Damn thats elite typing good job!!";
    if(wpm>=80&&acc>=95)return "nice one but and its pretty awesome too gud job";
    if(wpm>=60&&acc>=90)return "not bad comon you coan do it more!";
    if(wpm>=40&&acc>=85)return "very decent but not good enough";
    if(wpm>=20)return "damnnnnn you got absolutely cooked lmao ";
    return "bro you gotta practice more";
}
function saveToHistory(wpm,acc,mistakes,chars,elapsed){
    let entry={
        wpm,acc,mistakes,chars,elapsed,time:new Date()
    };
    runHistory.unshift(entry);
    if(runHistory.length>8)runHistory.pop();
    renderHistory();
}
function renderHistory(){
    if(runHistory.length===0){
        historyList.innerHTML='<div class="no-history">No history. take a test if you have guts</div>';
        return;
    }
    historyList.innerHTML='';
    runHistory.forEach(function(run,i){
        let item= document.createElement('div');
        item.classList.add('history-item');
        item.innerHTML=`
            <span class="h-num">#${runHistory.length-i}</span>
            <span class="h-wpm">${run.wpm} WPM</span>
            <span class="h-acc">${run.acc}>%</span>
            <span class="h-mistakes">${run.mistakes} err</span>
            <span class="h-time">${run.elapsed}s</span>
        `;
        historyList.appendChild(item);
    });
}
function resetTest(keepText){
    clearInterval(timerInterval);
    testrunning=false;
    testfinished=false;
    currentIdx=0;
    typedChars=0;
    mistakeCount =0;
    timerunning = totalTime;
    wordsCompleted=0;
    currentWordIdx= 0;
    totalKeystrokes= 0;
    correctKeystrokes=0;
    smoothedWpm=0;
    lastWpmUpdate=0;
    timeRemaining = totalTime;
    wpmDisplay.textContent ='--';
    accuracyDisplay.textContent='--';
    mistakesDisplay.textContent = '0';
    timerDisplay.textContent=totalTime;
    progressBar.style.width='0%';
    typingContainer.classList.remove('running');
    completeBar.classList.remove('show');
    resultsOverlay.classList.remove('visible');
    hiddenInput.value= '';
    if(!keepText){
        currentText=generateText();
    }
    renderText(currentText);
    buildworldboundaries(currentText);
    buildWordBar(currentText);
    hiddenInput.focus();
}
