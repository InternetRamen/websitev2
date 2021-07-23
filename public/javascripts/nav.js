
function classSwitch() {
    let hamburger = document.querySelector(".hamburger")
    let dropdown = document.querySelector(".linkDropdown")
    let body = document.body
    if (hamburger.classList.contains("burg")) {
        hamburger.classList.remove("burg")
        hamburger.classList.add("x")
        dropdown.classList.add("open")
        body.style.position = "relative";
        body.style.overflow = "hidden";
    } else if (hamburger.classList.contains("x")) {
        hamburger.classList.remove("x")
        hamburger.classList.add("burg")
        dropdown.classList.remove("open")
        body.style.overflow = "visible";
        body.style.position = "static";
    }

}

