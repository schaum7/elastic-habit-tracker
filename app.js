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
let habits = {};

initCalendar();

function initCalendar() {
  if (JSON.parse(localStorage.getItem("habits"))) {
    habits = JSON.parse(localStorage.getItem("habits"));
  }

  for (let i = 0; i < 7 * 7; i++) {
    let cell = document.createElement("div");
    cell.classList.add("calendar-cell");
    cell.setAttribute("id", i + "");
    if (i < 7) {
      cell.textContent = days[i];
      cell.classList.add("calendar-head");
    } else {
      cell.classList.add("calendar-day");
      cell.addEventListener("click", trackHabit);
      if (habits[i]) {
        cell.classList.add(habits[i]);
      }
    }
    calendar.appendChild(cell);
  }
}

function trackHabit() {
  id = parseInt(this.getAttribute("id"));

  if (this.classList.contains("mini")) {
    this.classList.remove("mini");
    this.classList.add("plus");
    habits[id] = "plus";
  } else if (this.classList.contains("plus")) {
    this.classList.remove("plus");
    this.classList.add("elite");
    habits[id] = "elite";
  } else if (this.classList.contains("elite")) {
    this.classList.remove("elite");
    delete habits[id];
  } else {
    this.classList.add("mini");
    habits[id] = "mini";
  }
  localStorage.setItem("habits", JSON.stringify(habits));
}
