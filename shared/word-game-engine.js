/* =============================================
   BanglaKids — Shared Word Game Engine
   Reads from gameData (set by data files)
   ============================================= */

let currentStep = 0;

function renderWord(word, highlightIndex) {
    let htmlWord = "";
    for (let i = 0; i < word.length; i++) {
        if (i === highlightIndex) {
            htmlWord += `<span class="highlight">${word[i]}</span>`;
        } else {
            htmlWord += word[i];
        }
    }
    return htmlWord;
}

function playSound(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.rate = 0.8;
        window.speechSynthesis.speak(msg);
    }
}

function renderStep() {
    const step = gameData[currentStep];
    const content = document.getElementById('gameContent');
    const nextBtn = document.getElementById('nextBtn');
    
    // Update overall game progress
    const progressPercent = (currentStep / (gameData.length - 1)) * 100;
    document.getElementById('progressFill').style.width = progressPercent + "%";

    if (step.type === 'learn') {
        nextBtn.style.display = 'block';
        content.innerHTML = `
            <div class="big-letter" style="font-size: 6rem; margin-bottom: 10px;" onclick="playSound('${step.sound}')">${step.letter}</div>
            <div class="words-grid">
                ${step.words.map(w => `
                    <div class="mini-word-card">
                        <div class="mini-emoji">${w.emoji}</div>
                        <div class="mini-word-text">${renderWord(w.word, w.hi)}</div>
                        <div class="mini-sub-text">${w.meaning}</div>
                    </div>
                `).join('')}
            </div>
        `;
        playSound(step.sound);
    } 
    else if (step.type === 'quiz') {
        nextBtn.style.display = 'none'; // Hide next until answered correctly
        content.innerHTML = `
            <div class="quiz-header">Find the starting letter!</div>
            <div class="mini-emoji" style="font-size: 6rem;">${step.emoji}</div>
            <div class="mini-word-text" style="font-size: 2rem; margin-bottom: 10px;">${step.meaning}</div>
            <div class="quiz-options">
                ${step.options.map(opt => `
                    <div class="quiz-option" onclick="checkAnswer(this, '${opt}', '${step.answer}')">${opt}</div>
                `).join('')}
            </div>
        `;
    } 
    else if (step.type === 'reward') {
        nextBtn.innerText = "Back to Home ➜";
        nextBtn.style.display = 'block';
        nextBtn.onclick = () => window.location.href = '../index.html';
        content.innerHTML = `
            <div class="star-container" style="margin-top: 50px;">
                <span class="star">⭐</span>
                <span class="star">⭐</span>
                <span class="star">⭐</span>
            </div>
            <div class="reward-text">Great Job!</div>
            <div class="sub-text">${step.message || 'You mastered these letters!'}</div>
        `;
        createConfetti();
        playSound("Great job!");
    }
}

window.checkAnswer = function(element, selected, correct) {
    if (selected === correct) {
        element.classList.add('correct');
        playSound('Correct');
        setTimeout(() => {
            nextStep();
        }, 1200);
    } else {
        element.classList.add('wrong');
        playSound('Oops');
        setTimeout(() => element.classList.remove('wrong'), 800);
    }
}

function nextStep() {
    if (currentStep < gameData.length - 1) {
        currentStep++;
        renderStep();
    }
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#fbc02d', '#45b7d1'];
    const container = document.getElementById('gameBox');
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Start the game
renderStep();