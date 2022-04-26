const left = document.querySelector(".left");
const right = document.querySelector(".right");
const middle = document.querySelector(".middle");
const container = document.querySelector(".container");

//Mouseover/hover class toggling

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
