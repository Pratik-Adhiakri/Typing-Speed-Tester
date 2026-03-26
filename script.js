const wordPool = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
  "she", "sells", "seashells", "by", "seashore", "time", "flies",
  "when", "you", "are", "having", "fun", "practice", "makes",
  "perfect", "never", "give", "up", "on", "dreams", "stay", "focused",
  "learn", "something", "new", "every", "single", "day", "push",
  "your", "limits", "just", "little", "bit", "further", "than",
  "yesterday", "work", "hard", "play", "harder", "keep", "moving",
  "forward", "think", "before", "act", "listen", "more", "speak",
  "less", "be", "kind", "to", "others", "help", "those", "in",
  "need", "live", "life", "fullest", "embrace", "change", "adapt",
  "grow", "stronger", "wiser", "with", "each", "passing", "moment",
  "sunrise", "golden", "horizon", "mountains", "rivers", "ocean",
  "waves", "crashing", "against", "rocky", "shore", "wind",
  "rustling", "through", "leaves", "forest", "deep", "within",
  "ancient", "trees", "stand", "tall", "proud", "bearing", "witness",
  "seasons", "come", "go", "cycle", "endless", "renewal", "rain",
  "falls", "softly", "earth", "drinks", "deeply", "flowers",
  "bloom", "vibrant", "colors", "paint", "world", "bright",
  "stars", "shine", "night", "sky", "lighting", "path", "wanderers",
  "moon", "rises", "casts", "silver", "glow", "across", "sleeping",
  "city", "streets", "empty", "quiet", "save", "distant",
  "echo", "footsteps", "lone", "traveler", "makes", "way",
  "home", "through", "fog", "drifts", "low", "ground", "cold",
  "breath", "visible", "air", "winter", "arriving", "uninvited",
  "yet", "familiar", "guest", "that", "stays", "too", "long",
  "eventually", "spring", "comes", "chase", "away", "chill",
  "warmth", "returns", "promise", "better", "days", "ahead",
  "coffee", "keyboard", "monitor", "screen", "code", "debug",
  "deploy", "commit", "branch", "merge", "review", "build",
  "test", "release", "iterate", "improve", "refactor", "document",
  "collaborate", "communicate", "design", "develop", "deliver",
  "problem", "solution", "challenge", "opportunity", "create",
  "innovate", "iterate", "again", "until", "right", "done", "hackclub","goatclub", "goat", "ronaldo","cr7","hacky"
];
//less go completed both of them 
const paragraphTemplates = [
  "the quick brown fox jumps over the lazy dog while the sun shines bright and warm across the golden fields of summer",
  "practice makes perfect and every great typist started somewhere just like you are starting now keep going and never stop",
  "rivers flow to the ocean carrying secrets from mountains high above where eagles soar and cold winds blow endlessly free",
  "the city never sleeps its lights burning through fog and rain as people move through streets searching for something beautiful",
  "coffee grows cold on desks where developers debug code late into the night chasing errors that seem to hide on purpose",
  "learn something new every single day push your limits just a little bit further than where you stopped yesterday morning",
  "stars shine brightest when the sky is darkest and that is when you find out what you are truly made of",
  "the hacky hacky club is the greaty greaty greatest club because hack is the best tech so hack is hack and ronaldo is ronaldo hence proved",
  "work hard and stay curious about the world around you because every corner has a story waiting to be discovered today",
  "the keyboard clicks softly in the quiet room where words become thoughts and thoughts become worlds worth living inside",
  "speed comes with time and accuracy comes with patience both are worth chasing because together they make you unstoppable"
];
const wordpool = wordPool;
const paragraphtemplates = paragraphTemplates;
let currentText = "";
let charElements= [];
let currentIdx= 0;
let typedChars=0;
let mistakeCount = 0;
let testrunning =false;
let testfinished=false;
let timerInterval=null;
let timerunning=30;
let timeRemaining=30;
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
    if(paragraphtemplates.length===0){
        return "Practice typing daily to improve speed and accuracy over time with calm focus and consistent rhythm.";
    }
    let baseIdx= Math.floor(Math.random()*paragraphtemplates.length);
    let base= paragraphtemplates[baseIdx];
    let extraWords= [];
    let needed= Math.max(0,80-base.split(' ').length);
    for(let i=0;i<needed;i++){
        if(wordpool.length>0){
            extraWords.push(wordpool[Math.floor(Math.random()*wordpool.length)]);
        }
    }
    let allWords= base.split(' ').concat(extraWords);
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
        span.innerHTML='&nbsp;';
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
function handleBackspace(){
    if(currentIdx<=0)return;
    currentIdx--;
    let span= charElements[currentIdx];
    let expectedChar= currentText[currentIdx];
    let wasCorrect= span.classList.contains('correct');
    let wasIncorrect= span.classList.contains('incorrect');

    span.classList.remove('correct','incorrect','pending');
    span.classList.add('current');

    if(currentIdx+1<charElements.length){
        charElements[currentIdx+1].classList.remove('current');
        charElements[currentIdx+1].classList.add('pending');
    }

    if(totalKeystrokes>0)totalKeystrokes--;
    if(typedChars>0)typedChars--;
    if(wasCorrect&&correctKeystrokes>0)correctKeystrokes--;
    if(wasIncorrect&&mistakeCount>0)mistakeCount--;

    if(expectedChar===' '&&wasCorrect&&wordsCompleted>0){
        wordsCompleted--;
        if(currentWordIdx>0)currentWordIdx--;
        updateWordBar();
    }

    mistakesDisplay.textContent= mistakeCount;
    updateAccuracy();
    updateLiveWpm();
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
        typingContainer.classList.add('running','test-active');
        starttimer();
        lastWpmUpdate= Date.now();
    }
    if(!testrunning&&e.key!=='Backspace')return;
    if(e.key==='Backspace'){
        handleBackspace();
        return;
    }
    if(e.key.length!==1)return;
    if(currentIdx>=currentText.length)return;
    let expectedChar= currentText[currentIdx];
    let typedChar=e.key;
    totalKeystrokes++;
    typedChars++; 
    charElements[currentIdx].classList.remove('current','pending');
    if(typedChar===expectedChar){
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
        charElements[currentIdx].classList.remove('pending');
        charElements[currentIdx].classList.add('current');
    }else{
        finishTest();
    }
    updateAccuracy();
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
    saveToHistory(finalWpm,finalAccuracy,mistakeCount,typedChars,elapsed);
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
    document.getElementById('resultRating').textContent=ratingText;
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
            <span class="h-acc">${run.acc}%</span>
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
    typingContainer.classList.remove('running','test-active');
    completeBar.classList.remove('show');
    resultsOverlay.classList.remove('visible');
    hiddenInput.value= '';
    if(!keepText){
        currentText=generateText();
    }
    renderText(currentText);
    buildworldboundaries(currentText);
    if(showWordBar){
        buildWordBar(currentText);
    }else{
        wordCountBar.innerHTML='';
    }
    hiddenInput.focus();
}
function initPresetButtons(){
    let presetsBtns=document.querySelectorAll('.preset-btn');
    presetsBtns.forEach(function(btn){
        btn.addEventListener('click',function(){
            let val=parseInt(btn.dataset.time);
            if(isNaN(val))return;
            totalTime=val;
            timeRemaining=val;
            presetsBtns.forEach(function(b){
                b.classList.remove('active');
            });
            btn.classList.add('active');
            resetTest(true);
        });
    });
}
function initCustomTime(){
    document.getElementById('setCustomBtn').addEventListener('click',function(){
        let val=parseInt(document.getElementById('customTimeInput').value);
        if(isNaN(val)||val<5||val>600){
            document.getElementById('customTimeInput').style.borderColor='var(--accent-alt)';
            setTimeout(function(){
                document.getElementById('customTimeInput').style.borderColor='';
            },800);
            return;
        }
        totalTime=val;
        timeRemaining=val;
        let presetsBtns=document.querySelectorAll('.preset-btn');
        presetsBtns.forEach(function(b){
            b.classList.remove('active');
        });
        resetTest(true);
    });
    document.getElementById('customTimeInput').addEventListener('keydown',function(e){
        if(e.key==='Enter'){
            document.getElementById('setCustomBtn').click();
        }
    });
}
typingContainer.addEventListener('click', function(e){
    hiddenInput.focus();
});
hiddenInput.addEventListener('keydown',function(e){
    handleKeyInput(e);
    e.preventDefault();
});
hiddenInput.addEventListener('keyup',function(e){
    if(e.key==='CapsLock'){
        capsLockOn=e.getModifierState&&e.getModifierState('CapsLock');
        if(capsLockOn){
            capIndicator.classList.add('visible');
        }else{
            capIndicator.classList.remove('visible');
        }
    }
});
hiddenInput.addEventListener('paste',function(e){
    e.preventDefault();
});
document.getElementById('restartBtn').addEventListener('click',function(){
    resetTest(true);
});
document.getElementById('newTextBtn').addEventListener('click',function(){
    resetTest(false);
});
document.getElementById('tryAgainBtn').addEventListener('click',function(){
    resetTest(false);
});
document.getElementById('newTestBtn').addEventListener('click',function(){
    resetTest(false);
});
document.addEventListener('keydown',function(e){
    if(e.key==='Tab'){
        if(document.activeElement!==hiddenInput){
            e.preventDefault();
            resetTest(true);
        }
    }
});
document.getElementById('wordBarToggle').addEventListener('change', function(e){
    showWordBar =e.target.checked;
    if(!showWordBar){
        wordCountBar.innerHTML='';
    }else{
        buildWordBar(currentText);
        updateWordBar();
    }
});
resultsOverlay.addEventListener('click',function(e){
    if(e.target===resultsOverlay){
        resultsOverlay.classList.remove('visible');
    }
});
initPresetButtons();
initCustomTime();
currentText = generateText();
renderText(currentText);
buildworldboundaries(currentText);
buildWordBar(currentText);
hiddenInput.focus();
//finally completed less gooo