const days = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"]
const calendar = document.querySelector(".calendar")


for (let i = 0; i < (7*7); i++) {
    let cell = document.createElement("div")
    cell.classList.add("calendar-cell")
    cell.setAttribute("id", "cell-" + i)
    if (i<7){
        cell.textContent = days[i]
        cell.classList.add("calendar-head")
    }else{
        cell.classList.add("calendar-day")
        cell.addEventListener("click",trackHabit)
    }
    calendar.appendChild(cell)  
}

function trackHabit() {
    if (this.classList.contains("mini")){
        this.classList.remove("mini")
        this.classList.add("plus")
        
    } else if (this.classList.contains("plus")){
        this.classList.remove("plus")
        this.classList.add("elite")

    }else if (this.classList.contains("elite")){
        this.classList.remove("elite")
        
    } else{
        this.classList.add("mini")
    }

}