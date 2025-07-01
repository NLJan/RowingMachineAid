
const driveBeep = new Audio("drive.mp3");
const recoveryBeep = new Audio("recovery.mp3");

const builtinPrograms = [
  {
    name: "Testprog",
    rounds: [
      { duration: 1, rest: 0.5, strokeRate: 24 },
      { duration: 1, rest: 0.5, strokeRate: 26 }
    ]
  },
  {
    "name": "Beginner Intervals",
    "rounds": [
      {
        "duration": 2,
        "rest": 1,
        "strokeRate": 20
      },
      {
        "duration": 2,
        "rest": 1,
        "strokeRate": 22
      },
      {
        "duration": 2,
        "rest": 0,
        "strokeRate": 24
      }
    ]
  },
  {
    "name": "Pyramid Challenge",
    "rounds": [
      {
        "duration": 1,
        "rest": 0.5,
        "strokeRate": 22
      },
      {
        "duration": 2,
        "rest": 0.5,
        "strokeRate": 24
      },
      {
        "duration": 3,
        "rest": 0.5,
        "strokeRate": 26
      },
      {
        "duration": 2,
        "rest": 0.5,
        "strokeRate": 24
      },
      {
        "duration": 1,
        "rest": 0,
        "strokeRate": 22
      }
    ]
  },
  {
    "name": "Power Strokes",
    "rounds": [
      {
        "duration": 1,
        "rest": 1,
        "strokeRate": 18
      },
      {
        "duration": 1,
        "rest": 1,
        "strokeRate": 18
      },
      {
        "duration": 1,
        "rest": 1,
        "strokeRate": 18
      },
      {
        "duration": 1,
        "rest": 1,
        "strokeRate": 18
      },
      {
        "duration": 1,
        "rest": 0,
        "strokeRate": 18
      }
    ]
  },
  {
    "name": "Endurance Builder",
    "rounds": [
      {
        "duration": 10,
        "rest": 2,
        "strokeRate": 22
      },
      {
        "duration": 10,
        "rest": 0,
        "strokeRate": 24
      }
    ]
  },
  {
    "name": "Fat Burn Intervals",
    "rounds": [
      {
        "duration": 3,
        "rest": 1,
        "strokeRate": 20
      },
      {
        "duration": 3,
        "rest": 1,
        "strokeRate": 24
      },
      {
        "duration": 3,
        "rest": 1,
        "strokeRate": 20
      },
      {
        "duration": 3,
        "rest": 0,
        "strokeRate": 24
      }
    ]
  },
  {
    "name": "Recovery Row",
    "rounds": [
      {
        "duration": 5,
        "rest": 1,
        "strokeRate": 18
      },
      {
        "duration": 5,
        "rest": 0,
        "strokeRate": 18
      }
    ]
  },
  {
    "name": "Advanced Intervals",
    "rounds": [
      {
        "duration": 2,
        "rest": 1,
        "strokeRate": 26
      },
      {
        "duration": 2,
        "rest": 1,
        "strokeRate": 28
      },
      {
        "duration": 2,
        "rest": 1,
        "strokeRate": 30
      },
      {
        "duration": 2,
        "rest": 1,
        "strokeRate": 28
      },
      {
        "duration": 2,
        "rest": 0,
        "strokeRate": 26
      }
    ]
  }
];

let programs = [...builtinPrograms];
let currentProgram = null;
let currentRound = 0;
let strokeCount = 0;
let intervalId = null;
let countdown = 5;
let totalElapsed = 0;
let paused = false;
let isRunning = false;
let currentSession = null;

const programSelect = document.getElementById("programs");
const countdownEl = document.getElementById("countdown");
const timeLeftEl = document.getElementById("timeLeft");
const totalTimeEl = document.getElementById("totalTime");
const strokeCountEl = document.getElementById("totalStrokes");
const roundEl = document.getElementById("round");
const progressFill = document.getElementById("progressFill");
const totalMinutesEl = document.getElementById("totalMinutes");
const avgStrokeRateEl = document.getElementById("avgStrokeRate");
const chartCanvas = document.getElementById("strokeChart");
const trainingChartCanvas = document.getElementById("trainingChart");
const avgDurationEl = document.getElementById("avgDuration");
const strokeCountVisual = document.getElementById("strokeCount");
const restIndicator = document.getElementById("restIndicator");
const importInput = document.getElementById("importInput");
const liveClockEl = document.getElementById("liveClock");
const exportHistoryBtn = document.getElementById("exportHistoryBtn");

const startStopBtn = document.getElementById("startStopBtn");
const pauseBtn = document.getElementById("pauseBtn");

startStopBtn.addEventListener("click", () => {
  if (!isRunning) {
    startSchema();
  } else {
    stopSchema();
  }
});

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Hervat" : "Pauze";
});

function startSchema() {
  isRunning = true;
  startStopBtn.textContent = "Herstart";
  paused = false;
  strokeCount = 0;
  totalElapsed = 0;
  currentRound = 0;

  currentSession = {
    startTime: new Date(),
    strokes: 0,
    duration: 0
  };

  countdown = 5;
  startCountdown();
}

function stopSchema() {
  isRunning = false;
  startStopBtn.textContent = "Start";

  clearInterval(intervalId);
  countdownEl.style.display = "none";
  restIndicator.style.display = "none";

  currentSession.endTime = new Date();
  currentSession.strokes = strokeCount;
  currentSession.duration = Math.round(totalElapsed / 60);

  saveStats();
  showStats();
  generateChart();
  generateTrainingStats();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateProgress(total, remaining) {
  const percent = Math.round(((total - remaining) / total) * 100);
  progressFill.style.width = percent + "%";
}

function startCountdown() {
  countdownEl.style.display = "block";
  countdownEl.classList.add("pulse");
  countdownEl.textContent = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      countdownEl.classList.remove("pulse");
      countdownEl.style.display = "none";
      startTraining();
    }
  }, 1000);
}

function startTraining() {
  const selectedIndex = programSelect.value;
  if (!programs[selectedIndex]) {
    alert("Selecteer een geldig programma.");
    return;
  }
  currentProgram = programs[selectedIndex];
  runRound();
}

function runRound() {
  if (currentRound >= currentProgram.rounds.length) {
    alert("Training voltooid!");
    stopSchema();
    return;
  }

  const round = currentProgram.rounds[currentRound];
  let time = round.duration * 60;
  const strokeRate = round.strokeRate;
  const cycleTime = 60 / strokeRate;
  const driveTime = cycleTime / 3;
  const recoveryTime = cycleTime * 2 / 3;

  roundEl.textContent = currentRound + 1;
  restIndicator.style.display = "none";

  function doStrokeCycle() {
    if (paused || !isRunning) return;

    if (time <= 0) {
      clearInterval(intervalId);
      if (round.rest > 0) {
        showRest(round.rest, () => {
          currentRound++;
          runRound();
        });
      } else {
        currentRound++;
        runRound();
      }
      return;
    }

    strokeImage.src = "stroke1.png";
    recoveryBeep.play();

    setTimeout(() => {
      strokeImage.src = "stroke2.png";
      driveBeep.play();
    }, driveTime * 1000);

    strokeCount++;
    strokeCountVisual.textContent = strokeCount;

    time -= cycleTime;
    totalElapsed += cycleTime;

    timeLeftEl.textContent = formatTime(Math.max(0, Math.floor(time)));
    totalTimeEl.textContent = formatTime(Math.floor(totalElapsed));
    updateProgress(round.duration * 60, time);
  }

  intervalId = setInterval(doStrokeCycle, cycleTime * 1000);
}

function showRest(restMinutes, callback) {
  let remaining = restMinutes * 60;
  restIndicator.style.display = "block";
  restIndicator.textContent = "Rusttijd";

  const restInterval = setInterval(() => {
    if (paused || !isRunning) return;

    remaining--;
    timeLeftEl.textContent = formatTime(remaining);
    updateProgress(restMinutes * 60, remaining);

    if (remaining <= 0) {
      clearInterval(restInterval);
      restIndicator.style.display = "none";
      callback();
    }
  }, 1000);
}

function saveStats() {
  const stats = {
    strokes: strokeCount,
    minutes: Math.round(totalElapsed / 60),
    avgRate: Math.round(strokeCount / (totalElapsed / 60))
  };
  localStorage.setItem("stats", JSON.stringify(stats));
  saveTrainingToHistory(stats.minutes);
}

function showStats() {
  const stats = JSON.parse(localStorage.getItem("stats"));
  if (stats) {
    strokeCountEl.textContent = stats.strokes;
    totalMinutesEl.textContent = stats.minutes;
    avgStrokeRateEl.textContent = stats.avgRate;
  }
}

function generateChart() {
  const roundData = currentProgram.rounds.map(r => r.strokeRate);
  const labels = currentProgram.rounds.map((_, i) => "Ronde " + (i + 1));

  new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Slagfrequentie",
        data: roundData,
        backgroundColor: "#4CAF50"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function getTrainingHistory() {
  return JSON.parse(localStorage.getItem("trainingHistory") || "[]");
}

function saveTrainingToHistory(minutes) {
  const history = getTrainingHistory();
  const now = new Date();
  history.push({
    date: now.toISOString(),
    duration: minutes
  });
  localStorage.setItem("trainingHistory", JSON.stringify(history));
}

function generateTrainingStats() {
  const history = getTrainingHistory();
  if (history.length === 0) return;

  const monthlyCounts = {};
  let totalDuration = 0;

  history.forEach(entry => {
    const date = new Date(entry.date);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    totalDuration += entry.duration;
  });

  const labels = Object.keys(monthlyCounts);
  const data = Object.values(monthlyCounts);
  const avgDuration = Math.round(totalDuration / history.length);

  avgDurationEl.textContent = `${avgDuration} min`;

  new Chart(trainingChartCanvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Voltooide trainingen per maand",
        data: data,
        backgroundColor: "#2196F3"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

document.getElementById("resetBtn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("newProgramBtn").addEventListener("click", () => {
  const newProgram = {
    name: prompt("Naam van nieuw programma:", "Nieuw Programma"),
    rounds: []
  };

  let addMore = true;
  while (addMore) {
    const duration = parseFloat(prompt("Duur van ronde (minuten):", "1"));
    const rest = parseFloat(prompt("Rusttijd na ronde (minuten):", "1"));
    const strokeRate = parseInt(prompt("Slagfrequentie:", "24"));
    if (!isNaN(duration) && !isNaN(rest) && !isNaN(strokeRate)) {
      newProgram.rounds.push({ duration, rest, strokeRate });
    }
    addMore = confirm("Nog een ronde toevoegen?");
  }

  programs.push(newProgram);
  const opt = document.createElement("option");
  opt.value = programs.length - 1;
  opt.textContent = newProgram.name;
  programSelect.appendChild(opt);
  programSelect.value = programs.length - 1;
  programSelect.dispatchEvent(new Event("change"));
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const selectedProgram = programs[programSelect.value];
  const blob = new Blob([JSON.stringify(selectedProgram, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = selectedProgram.name.replace(/\s+/g, "_") + ".json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importBtn").addEventListener("click", () => {
  importInput.click();
});

importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedProgram = JSON.parse(e.target.result);
      if (importedProgram.name && Array.isArray(importedProgram.rounds)) {
        programs.push(importedProgram);
        const opt = document.createElement("option");
        opt.value = programs.length - 1;
        opt.textContent = importedProgram.name;
        programSelect.appendChild(opt);
        programSelect.value = programs.length - 1;
        programSelect.dispatchEvent(new Event("change"));
      } else {
        alert("Ongeldig programmaformaat.");
      }
    } catch (err) {
      alert("Fout bij het importeren van het programma.");
    }
  };
  reader.readAsText(file);
});

programSelect.addEventListener("change", () => {
  const tbody = document.querySelector("#programTable tbody");
  tbody.innerHTML = "";
  const selectedIndex = programSelect.value;
  const selectedProgram = programs[selectedIndex];
  if (selectedProgram) {
    selectedProgram.rounds.forEach((r, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${idx + 1}</td><td>${r.duration}</td><td>${r.rest}</td><td>${r.strokeRate}</td>`;
      tbody.appendChild(row);
    });
  }

  updateProgramTotals();
});

window.addEventListener("load", () => {
  programs.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = p.name;
    programSelect.appendChild(opt);
  });
  programSelect.dispatchEvent(new Event("change"));
  generateTrainingStats();
  updateLiveClock();
});

function updateProgramTotals() {
  const selectedIndex = programSelect.value;
  const selectedProgram = programs[selectedIndex];
  if (!selectedProgram) return;

  const totalDuration = selectedProgram.rounds.reduce((sum, round) => sum + round.duration, 0);
  const totalRest = selectedProgram.rounds.reduce((sum, round) => sum + round.rest, 0);
  const totalCombined = totalDuration + totalRest;

  document.getElementById("totalDuration").textContent = formatTime(totalDuration * 60);
  document.getElementById("totalRest").textContent = formatTime(totalRest * 60);
  document.getElementById("totalCombined").textContent = formatTime(totalCombined * 60);
}

// Visuele klok
function updateLiveClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  if (liveClockEl) {
    liveClockEl.textContent = `${h}:${m}:${s}`;
  }
}
setInterval(updateLiveClock, 1000);

// Export trainingsgeschiedenis als CSV
if (exportHistoryBtn) {
  exportHistoryBtn.addEventListener("click", () => {
    const history = getTrainingHistory();
    const csv = history.map(h => `${h.date},${h.duration}`).join("\n");
    const blob = new Blob(["Datum,Duur (min)\n" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
}
