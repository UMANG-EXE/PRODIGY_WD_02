document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const lapsList = document.getElementById('lapsList');
    const splitBtn = document.getElementById('splitBtn');
    const themeToggle = document.getElementById('theme-toggle');

    let timerInterval = null;
    let startTime = 0;
    let elapsedTime = 0;
    let laps = [];
    let splitTimes = [];

    loadLaps();

    function updateDisplay(time) {
        const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
        const milliseconds = String(time % 1000).padStart(3, '0');
        display.textContent = `${minutes}:${seconds}:${milliseconds}`;
    }

    function startPauseTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            startPauseBtn.textContent = 'Start';
        } else {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                updateDisplay(elapsedTime);
                checkSoundAlert(elapsedTime);
            }, 10);
            startPauseBtn.textContent = 'Pause';
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime = 0;
        laps = [];
        splitTimes = [];
        updateDisplay(0);
        startPauseBtn.textContent = 'Start';
        lapsList.innerHTML = '';
    }

    function addLap() {
        if (timerInterval) {
            const lapTime = elapsedTime - laps.reduce((acc, curr) => acc + curr, 0);
            laps.push(lapTime);
            renderLaps();
        }
    }

    function renderLaps() {
        lapsList.innerHTML = '';
        laps.forEach((lapTime, index) => {
            const lapItem = document.createElement('li');
            const minutes = String(Math.floor((lapTime % 3600000) / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((lapTime % 60000) / 1000)).padStart(2, '0');
            const milliseconds = String(lapTime % 1000).padStart(3, '0');
            lapItem.textContent = `Lap ${index + 1}: ${minutes}:${seconds}:${milliseconds}`;
            lapItem.classList.add('lap-item');
            lapsList.appendChild(lapItem);
        });
    }

    function saveLaps() {
        localStorage.setItem('laps', JSON.stringify(laps));
    }

    function loadLaps() {
        const savedLaps = JSON.parse(localStorage.getItem('laps'));
        if (savedLaps) {
            laps = savedLaps;
            renderLaps();
        }
    }

    function recordSplit() {
        if (timerInterval) {
            splitTimes.push(elapsedTime);
            renderSplits();
        }
    }

    function renderSplits() {
        const splitList = document.getElementById('splitList');
        splitList.innerHTML = '';
        splitTimes.forEach((splitTime, index) => {
            const splitItem = document.createElement('li');
            const minutes = String(Math.floor((splitTime % 3600000) / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((splitTime % 60000) / 1000)).padStart(2, '0');
            const milliseconds = String(splitTime % 1000).padStart(3, '0');
            splitItem.textContent = `Split ${index + 1}: ${minutes}:${seconds}:${milliseconds}`;
            splitList.appendChild(splitItem);
        });
    }

    function checkSoundAlert(elapsedTime) {
        const soundAlertTimes = [60000, 300000, 600000];
        soundAlertTimes.forEach(time => {
            if (elapsedTime >= time && elapsedTime - 10 < time) {
                playSoundAlert();
            }
        });
    }

    function playSoundAlert() {
        
    }

    startPauseBtn.addEventListener('click', startPauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', addLap);
    saveBtn.addEventListener('click', saveLaps);
    loadBtn.addEventListener('click', loadLaps);
    splitBtn.addEventListener('click', recordSplit);

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    
    window.onload = function() {
        resetTimer();
    };
});
