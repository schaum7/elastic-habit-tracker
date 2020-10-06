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

let activeHabit = 0;
let habitCategories = ["Sport", "Programmieren", "Achtsamkeit"];
let habitsTrack = {};
let month = 09;

initCalendar();

function initCalendar() {
  if (JSON.parse(localStorage.getItem("habits"))) {
    habitsTrack = JSON.parse(localStorage.getItem("habits"));
  } else {
    habitCategories.forEach((habit) => {
      habitsTrack[habitCategories.indexOf(habit)] = {};
    });
  }

  habitCategories.forEach((habit) => {
    let button = document.createElement("button");
    button.textContent = habit;
    button.setAttribute("id", habit);
    button.addEventListener("click", changeHabit);
    tabContainer.appendChild(button);
  });

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
  activeHabit = habitCategories.indexOf(this.id);
  console.log(activeHabit);
  drawGrid();
}

function drawGrid() {
  let date = new Date(2020, month, 1);
  let firstDay = date.getDay() + 6;
  calendar.innerHTML = "";

  console.log(habitsTrack);
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
