const days = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
const calendar = document.querySelector(".calendar");
const tabContainer = document.querySelector(".habit-tabs");
const btnAddHabit = document.getElementById("addHabit");
const btnRemoveHabit = document.getElementById("removeHabit");
const inputHabit = document.getElementById("habitInput");
const monthList = document.querySelector(".months ul");
const btnAddMonth = document.getElementById("addmonth");
const message = document.getElementById("message");
const btnPrevYear = document.getElementById("previousYear");
const btnNextYear = document.getElementById("nextYear");
const lblYear = document.getElementById("yearLabel");

let habitCategories = ["Sport", "Programmieren", "Achtsamkeit"];
let habitYearsMonths = { 2020: [9] };
let habitsTrack = {};
let activeYear = 2020;
let activeMonth = 9;
let activeHabit = habitCategories[0];

loadCalendar();
loadSidebar();

btnAddHabit.addEventListener("click", addHabit);
btnRemoveHabit.addEventListener("click", removeHabit);
btnAddMonth.addEventListener("click", addMonth);
btnPrevYear.addEventListener("click", changeMonth);
btnNextYear.addEventListener("click", changeMonth);

function loadSidebar() {
  monthList.innerHTML = "";
  lblYear.textContent = activeYear;
  habitYearsMonths[activeYear].forEach((month) => {
    let li = document.createElement("li");
    li.textContent = months[month];
    li.addEventListener("click", changeActiveMonth);
    if (month == activeMonth) {
      li.classList.add("active-tab");
    }
    monthList.appendChild(li);
  });
}

function loadCalendar() {
  if (JSON.parse(localStorage.getItem("habits"))) {
    loadLocalStorage();
  } else {
    initHabitTrackerObject();
  }
  createButtons();
  drawGrid();
}

function trackHabit() {
  id = parseInt(this.getAttribute("id"));

  if (this.classList.contains("mini")) {
    this.classList.remove("mini");
    this.classList.add("plus");
    habitsTrack[activeYear][activeMonth][activeHabit][id] = "plus";
  } else if (this.classList.contains("plus")) {
    this.classList.remove("plus");
    this.classList.add("elite");
    habitsTrack[activeYear][activeMonth][activeHabit][id] = "elite";
  } else if (this.classList.contains("elite")) {
    this.classList.remove("elite");
    delete habitsTrack[activeYear][activeMonth][activeHabit][id];
  } else {
    this.classList.add("mini");
    habitsTrack[activeYear][activeMonth][activeHabit][id] = "mini";
  }
  updateLocalStorage();
}

function changeHabit() {
  activeHabit = this.id;
  let allButtons = document.querySelectorAll(".habit-tabs button");
  allButtons.forEach((button) => {
    button.classList.remove("active-tab");
  });
  this.classList.add("active-tab");
  drawGrid();
}

function drawGrid() {
  let date = new Date(activeYear, activeMonth, 1);
  let firstDay = date.getDay() + 6;
  calendar.innerHTML = "";

  for (let i = 0; i < 7 * 7; i++) {
    let cell = document.createElement("div");
    let text = document.createElement("p");
    cell.appendChild(text);
    cell.classList.add("calendar-cell");
    cell.setAttribute("id", i + "");
    if (i < 7) {
      text.textContent = days[i];
      cell.classList.add("calendar-head");
      calendar.appendChild(cell);
    } else {
      cell.classList.add("calendar-day");
      if (i < firstDay) {
        calendar.appendChild(cell);
      } else if (i >= firstDay && date.getMonth() === activeMonth) {
        text.textContent = date.getDate();
        date.setDate(date.getDate() + 1);
        cell.addEventListener("click", trackHabit);
        if (habitsTrack[activeYear][activeMonth][activeHabit][i]) {
          cell.classList.add(
            habitsTrack[activeYear][activeMonth][activeHabit][i]
          );
        }
        calendar.appendChild(cell);
      }
    }
  }
}

function createButtons() {
  tabContainer.innerHTML = "";

  habitCategories.forEach((habit) => {
    let button = document.createElement("button");
    button.textContent = habit;
    button.setAttribute("id", habit);
    button.addEventListener("click", changeHabit);
    tabContainer.appendChild(button);
  });
  document.querySelector(".habit-tabs button").classList.add("active-tab");
}

function addHabit() {
  const habit = inputHabit.value;
  if (habit === "") {
    showMessage("error", "Kann nicht hinzufügen. Kein Habitname angegeben");
  } else {
    habitsTrack[activeYear][activeMonth][habit] = {};
    habitCategories.push(habit);
    updateLocalStorage();
    inputHabit.value = "";
    showMessage("success", "Habit wurde hinzugefügt.");
    loadCalendar();
  }
}

function removeHabit() {
  const habit = inputHabit.value;
  if (habit === "") {
    showMessage("error", "Kann nicht entfernen. Kein Habitname angegeben");
  } else {
    delete habitsTrack[activeYear][activeMonth][habit];
    updateLocalStorage();
    inputHabit.value = "";
    showMessage("success", "Habit wurde entfernt.");
    loadCalendar();
  }
}

function loadLocalStorage() {
  habitsTrack = JSON.parse(localStorage.getItem("habits"));
  Object.keys(habitsTrack).forEach((year) => {
    habitYearsMonths[year] = [];
  });
  habitYearsMonths[activeYear] = Object.keys(habitsTrack[activeYear]);
  habitCategories = Object.keys(habitsTrack[activeYear][activeMonth]);
}

function initHabitTrackerObject() {
  Object.keys(habitYearsMonths).forEach((year) => {
    habitsTrack[year] = {};
    habitYearsMonths[year].forEach((month) => {
      habitsTrack[year][month] = {};
      habitCategories.forEach((habit) => {
        habitsTrack[year][month][habit] = {};
      });
    });
  });
}

function addMonth() {
  let monthToAdd =
    Math.max(...habitYearsMonths[activeYear].map((x) => parseInt(x))) + 1;

  console.log(monthToAdd);
  if (monthToAdd <= 11) {
    habitYearsMonths[activeYear].push(monthToAdd);
    habitsTrack[activeYear][monthToAdd] = {};
    habitCategories.forEach((habit) => {
      habitsTrack[activeYear][monthToAdd][habit] = {};
    });
  }
  updateLocalStorage();
  loadSidebar();
}

function updateLocalStorage() {
  localStorage.setItem("habits", JSON.stringify(habitsTrack));
}

function changeActiveMonth() {
  activeMonth = months.indexOf(this.textContent);
  monthList.querySelectorAll("li").forEach((li) => {
    li.classList.remove("active-tab");
  });
  this.classList.add("active-tab");

  drawGrid();
}

function showMessage(type, messageText) {
  message.classList.add(type);
  message.textContent = messageText;
  setTimeout(() => {
    message.textContent = "";
    message.classList.remove(type);
  }, 3000);
}

function changeMonth() {
  if (this.id === "previousYear") {
    activeYear -= 1;
  } else {
    activeYear += 1;
  }

  if (!Object.keys(habitYearsMonths).includes(activeYear + "")) {
    habitYearsMonths[activeYear] = [0];
    habitsTrack[activeYear] = {};
    habitsTrack[activeYear][0] = {};
    habitCategories.forEach((habit) => {
      habitsTrack[activeYear][0][habit] = {};
    });
  }

  activeMonth = Object.keys(habitsTrack[activeYear])[0];

  updateLocalStorage();
  loadSidebar();
  loadCalendar();
}
