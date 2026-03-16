/* =============================================
   BanglaKids — Game Engine
   Reads from window.LETTERS (set by data files)
   ============================================= */

let currentLetterIndex = 0;

function loadLetterData(index) {
    const data = window.LETTERS[index];
    document.getElementById('levelIndicator').innerText = `Level ${index + 1}: Letter ${data.char}`;
    document.getElementById('animLetter').innerText = data.char;
    document.getElementById('wordEmoji').innerText = data.emoji;

    let htmlWord = "";
    for (let i = 0; i < data.word.length; i++) {
        if (i === data.highlightIndex) {
            htmlWord += `<span class="highlight">${data.word[i]}</span>`;
        } else {
            htmlWord += data.word[i];
        }
    }
    document.getElementById('wordText').innerHTML = htmlWord;
    document.getElementById('wordMeaning').innerText = data.meaning;
    document.getElementById('traceLetter').innerText = data.char;

    const hintImg = document.getElementById('traceHintImg');
    if (hintImg && data.traceImage) hintImg.src = data.traceImage;

    // Add green starting dot for tracing
    addStartingDot(data);

    updateProgress(0);
    document.getElementById('dotsNav').style.display = 'flex';
}

function addStartingDot(data) {
    // Remove existing dot if any
    const existingDot = document.getElementById('startingDot');
    if (existingDot) existingDot.remove();

    // Create green starting dot
    const dot = document.createElement('div');
    dot.id = 'startingDot';
    dot.style.position = 'absolute';
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.backgroundColor = '#4CAF50';
    dot.style.borderRadius = '50%';
    dot.style.zIndex = '10';
    dot.style.pointerEvents = 'none';

    // Position the dot based on the letter data
    dot.style.top = data.startDotTop;
    dot.style.left = data.startDotLeft;

    // Add to canvas wrapper
    document.querySelector('.canvas-wrapper').appendChild(dot);
}

function goToStep(stepNum) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

    document.getElementById('s' + stepNum).classList.add('active');
    if (stepNum <= 3) document.getElementById('d' + stepNum).classList.add('active');

    if (stepNum === 1) updateProgress(10);
    if (stepNum === 2) updateProgress(50);
    if (stepNum === 3) updateProgress(80);

    const hintPanel = document.getElementById('traceHintPanel');
    if (hintPanel) {
        hintPanel.classList.toggle('visible', stepNum === 3);
    }
}

function showReward() {
    document.getElementById('dotsNav').style.display = 'none';
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('sReward').classList.add('active');

    const hintPanel = document.getElementById('traceHintPanel');
    if (hintPanel) hintPanel.classList.remove('visible');

    updateProgress(100);
    createConfetti();

    const btn = document.getElementById('nextLevelBtn');
    if (currentLetterIndex < window.LETTERS.length - 1) {
        btn.innerText = "Next Letter ➜";
        btn.onclick = nextLetter;
    } else {
        btn.innerText = "Restart ↺";
        btn.onclick = () => {
            currentLetterIndex = 0;
            clearCanvas();
            loadLetterData(0);
            goToStep(1);
        };
    }
}

function nextLetter() {
    if (currentLetterIndex < window.LETTERS.length - 1) {
        currentLetterIndex++;
        clearCanvas();
        loadLetterData(currentLetterIndex);
        goToStep(1);
    }
}

function updateProgress(percent) {
    document.getElementById('progressFill').style.width = percent + "%";
}

function playSound() {
    const data = window.LETTERS[currentLetterIndex];
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = data.soundText;
        msg.rate = 0.8;
        window.speechSynthesis.speak(msg);
    }
    const el = document.getElementById('animLetter');
    el.classList.remove('bouncing');
    void el.offsetWidth;
    el.classList.add('bouncing');
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

/* --- Canvas --- */
const canvas = document.getElementById('traceCanvas');
const ctx = canvas.getContext('2d');
let painting = false;

ctx.lineWidth = 18;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#444';

function startPosition(e) { painting = true; draw(e); }
function finishedPosition() { painting = false; ctx.beginPath(); }
function draw(e) {
    if (!painting) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', finishedPosition);
canvas.addEventListener('touchmove', draw);

function clearCanvas() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    // Re-add the starting dot
    const data = window.LETTERS[currentLetterIndex];
    addStartingDot(data);
}

/* --- Init --- */
loadLetterData(0);
goToStep(1);
