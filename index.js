//Trisplit
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const middle = document.querySelector(".middle");
const container = document.querySelector(".container");
//Header/Nav
const headNav = document.querySelector(".built-with")
const navBar = document.querySelector(".nav-bar")

//Mouseover/hover class toggling for nav
headNav.addEventListener("mouseenter", () => {
    navBar.classList.remove("nav-up");
  });
  
  navBar.addEventListener("mouseleave", () => {
    navBar.classList.add("nav-up");
});

//Mouseover/hover class toggling for tri-split area
//LEFT
left.addEventListener("mouseenter", () => {
  container.classList.add("hover-left");
});

left.addEventListener("mouseleave", () => {
  container.classList.remove("hover-left");
});

//RIGHT
right.addEventListener("mouseenter", () => {
  container.classList.add("hover-right");
});

right.addEventListener("mouseleave", () => { container.classList.remove("hover-right");
});

//MIDDLE
middle.addEventListener("mouseenter", () => {
  container.classList.add("hover-middle");
});

middle.addEventListener("mouseleave", () => {
  container.classList.remove("hover-middle");
});
