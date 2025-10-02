const elements = {
    selectTimeMessage: document.getElementById("selectTimeMessage"),
    displayHour: document.getElementById("displayHour"),
    displayMinute: document.getElementById("displayMinute"),
    displaySecond: document.getElementById("displaySecond"),
    timeUpMessage: document.getElementById("timeUpMessage"),
    hourSelect: document.getElementById("selectHour"),
    minuteSelect: document.getElementById("selectMinute"),
    secondSelect: document.getElementById("selectSecond"),
    startButton: document.getElementById("startButton"),
    resetButton: document.getElementById("resetButton"),
    toggleFullscreenButton: document.getElementById("toggleFullscreenButton"),
    currentDate: document.getElementById("currentDate"),
    currentTime: document.getElementById("currentTime"),
    selectTimeModal: document.getElementById("selectTimeModal")
};

document.addEventListener("DOMContentLoaded", () => {
    initializeTimeSelects();
    updateCurrentTime();
    setFontSize();
    setInterval(updateCurrentTime, 1000);

    window.addEventListener("resize", setFontSize);
    elements.startButton.addEventListener("click", startTimer);
    elements.resetButton.addEventListener("click", resetTimer);
    elements.toggleFullscreenButton.addEventListener("click", toggleFullscreen);
});

let timerInterval;

function initializeTimeSelects() {
    populateTimeSelects(elements.hourSelect, 24);
    populateTimeSelects(elements.minuteSelect, 60);
    populateTimeSelects(elements.secondSelect, 60);
}

function populateTimeSelects(selectElement, range) {
    for (let i = 0; i < range; i++) {
        const option = document.createElement("option");
        option.value = option.text = String(i).padStart(2, '0');
        selectElement.add(option);
    }
}

function updateCurrentTime() {
    const now = new Date();
    elements.currentDate.innerHTML = now.toLocaleDateString('en-GB').replace(/\//g, '-');
    elements.currentTime.innerHTML = now.toLocaleTimeString();
}

function startTimer() {
    resetTimer();

    const hours = elements.hourSelect.value;
    const minutes = elements.minuteSelect.value;
    const seconds = elements.secondSelect.value;

    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, seconds, 0);

    if (targetTime <= now) {
        showSelectTimeMessage("Please select a time later than the current time today!");
        return;
    }

    hideSelectTimeMessage();
    closeSelectTimeModal();

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetTime.getTime() - now;

        if (difference < 0) {
            displayTimeUp();
            return;
        }

        updateDisplay(difference);
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    updateDisplay(0);
    elements.timeUpMessage.classList.add("d-none");
}

function displayTimeUp() {
    elements.timeUpMessage.classList.remove("d-none");
    clearInterval(timerInterval);
    updateDisplay(0);
}

function updateDisplay(difference) {
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    elements.displayHour.innerText = String(hours).padStart(2, '0');
    elements.displayMinute.innerText = String(minutes).padStart(2, '0');
    elements.displaySecond.innerText = String(seconds).padStart(2, '0');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen(document.documentElement);
    } else {
        exitFullscreen();
    }
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

function showSelectTimeMessage(message) {
    elements.selectTimeMessage.innerText = message;
    elements.selectTimeMessage.classList.remove("d-none");
}

function hideSelectTimeMessage() {
    elements.selectTimeMessage.classList.add("d-none");
}

function closeSelectTimeModal() {
    const modal = bootstrap.Modal.getInstance(elements.selectTimeModal);
    modal.hide();
}

function setFontSize() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const cardHeight = card.clientHeight;
        const fontSize = cardHeight * 0.55;
        card.querySelector(".card-title").style.fontSize = `${fontSize}px`;
    });
}