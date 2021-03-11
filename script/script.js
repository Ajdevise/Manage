const hamburgerButton = document.querySelector("#nav-button");
const mobileMenuOverlay = document.querySelector("#mobile-menu-overlay");
const mobileMenu = document.querySelector("#mobile-menu");
const testimonialGrid = document.querySelector(".section-testimonials__grid");
const testimonial = document.querySelector(".testimonial");
const body = document.querySelector("body");
const controls = document.querySelectorAll(".control");
let mouseDown = false;
let startX = 0;
let total = 0;
let mouseUpTotal = 0;
let width = 0;

const toggleMenu = () => {
    hamburgerButton.classList.toggle("is-active");
    mobileMenuOverlay.classList.toggle("is-active");
    mobileMenu.classList.toggle("is-active");
    document.documentElement.classList.toggle("deactivate-scroll");
}

const mouseDownOnTestimonialGrid = (e) => {
    e.preventDefault();
    removeTransition();
    mouseDown = true;
    startX = getStartXCoordinate(e);
    width = testimonial.clientWidth;
}

const mouseUpFromBody = (e) => {
    mouseDown = false;
    mouseUpTotal = total;
}

const mouseMoveOnBody = (e) => {
    if(!mouseDown) return;
    let walk = 0;
    let clientX = getStartXCoordinate(e);

    walk = clientX - startX;
    total = mouseUpTotal + walk;
    total = limitReached(total);
    
    moveTestimonialGrid(total, false);
    selectControlBasedOnTranslation(total);
}

const reset = () => {
    moveTestimonialGrid(0, false);
    total = 0;
    mouseUpTotal = 0;
    selectControlBasedOnTranslation(mouseUpTotal);
}

const limitReached = (total) => {
    let upperLimit = testimonialGrid.clientWidth - (4 * width + 96);
    if(total > 0) return 0;
    if(total < upperLimit) return upperLimit;
    return total;
}

const getStartXCoordinate = (e) => {
    if(e.clientX) {
        return e.clientX;
    } else {
        return e.touches[0].clientX;
    }
}

const removeClassesFromControls = () => {
    controls.forEach(control => control.classList.remove("is-active"));
}

const makeControlActive = (id) => {
    removeClassesFromControls();
    controls.forEach(control => {
        if(parseInt(control.id) === id) {
            control.classList.add("is-active");
        }
    })
}

const selectControlBasedOnTranslation = (pixelsTranslated) => {
    let idOfActiveControl = Math.floor(pixelsTranslated / (width - 32)) * -1;
    if(idOfActiveControl === 0) idOfActiveControl = 1;
    makeControlActive(idOfActiveControl);
}

const moveTestimonialGrid = (amount, toAddAmountToTotal) => {
    if(toAddAmountToTotal) mouseUpTotal = amount;
    testimonialGrid.style.transform = `translate(${amount}px)`;
}

const removeTransition = () => {
    testimonialGrid.style.transition = "";
}

const moveTestimonialGridBasedOnActiveControl = (e) => {
    width = testimonial.clientWidth;
    let id = parseInt(e.target.id);
    let translateAmount = ((id - 1) * width + (id - 1) * 32) * -1;
    testimonialGrid.style.transition = "all .3s linear";
    makeControlActive(id);
    moveTestimonialGrid(translateAmount, true);
}

controls.forEach(control => {
    control.addEventListener("click", moveTestimonialGridBasedOnActiveControl);
})

hamburgerButton.addEventListener("click", toggleMenu);
mobileMenuOverlay.addEventListener("click", toggleMenu);
testimonialGrid.addEventListener("mousedown", mouseDownOnTestimonialGrid);
testimonialGrid.addEventListener("touchstart", mouseDownOnTestimonialGrid);
body.addEventListener("mouseup", mouseUpFromBody);
body.addEventListener("mousemove", mouseMoveOnBody);
body.addEventListener("touchend", mouseUpFromBody);
body.addEventListener("touchmove", mouseMoveOnBody);
window.addEventListener("resize", reset);