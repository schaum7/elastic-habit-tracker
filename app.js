const days = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];
const calendar = document.querySelector(".calendar");
const tabContainer = document.querySelector(".habit-tabs");
const btnAddHabit = document.getElementById("addHabit");
const btnRemoveHabit = document.getElementById("removeHabit");
const inputHabit = document.getElementById("habitInput");

let habitCategories = ["Sport", "Programmieren", "Achtsamkeit"];
let activeHabit = habitCategories[0];
let habitsTrack = {};
let month = 09;

initCalendar();

btnAddHabit.addEventListener("click", addHabit);
btnRemoveHabit.addEventListener("click", removeHabit);

function initCalendar() {
  if (JSON.parse(localStorage.getItem("habits"))) {
    habitsTrack = JSON.parse(localStorage.getItem("habits"));
    habitCategories = Object.keys(habitsTrack);
  } else {
    habitCategories.forEach((habit) => {
      habitsTrack[habit] = {};
    });
  }
  createButtons();
  drawGrid();
}

function trackHabit() {
  id = parseInt(this.getAttribute("id"));

  if (this.classList.contains("mini")) {
    this.classList.remove("mini");
    this.classList.add("plus");
    habitsTrack[activeHabit][id] = "plus";
  } else if (this.classList.contains("plus")) {
    this.classList.remove("plus");
    this.classList.add("elite");
    habitsTrack[activeHabit][id] = "elite";
  } else if (this.classList.contains("elite")) {
    this.classList.remove("elite");
    delete habitsTrack[activeHabit][id];
  } else {
    this.classList.add("mini");
    habitsTrack[activeHabit][id] = "mini";
  }
  localStorage.setItem("habits", JSON.stringify(habitsTrack));
}

function changeHabit() {
  activeHabit = this.id;
  drawGrid();
}

function drawGrid() {
  let date = new Date(2020, month, 1);
  let firstDay = date.getDay() + 6;
  calendar.innerHTML = "";

  for (let i = 0; i < 7 * 7; i++) {
    let cell = document.createElement("div");
    cell.classList.add("calendar-cell");
    cell.setAttribute("id", i + "");
    if (i < 7) {
      cell.textContent = days[i];
      cell.classList.add("calendar-head");
      calendar.appendChild(cell);
    } else {
      cell.classList.add("calendar-day");
      if (i < firstDay) {
        calendar.appendChild(cell);
      } else if (i >= firstDay && date.getMonth() === month) {
        cell.innerText = date.getDate();
        date.setDate(date.getDate() + 1);
        cell.addEventListener("click", trackHabit);
        if (habitsTrack[activeHabit][i]) {
          cell.classList.add(habitsTrack[activeHabit][i]);
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
}
function addHabit() {
  const habit = inputHabit.value;
  habitsTrack[habit] = {};
  habitCategories.push(habit);
  localStorage.setItem("habits", JSON.stringify(habitsTrack));
  inputHabit.value = "";
  initCalendar();
}
function removeHabit() {
  const habit = inputHabit.value;
  delete habitsTrack[habit];
  localStorage.setItem("habits", JSON.stringify(habitsTrack));
  inputHabit.value = "";
  initCalendar();
}
