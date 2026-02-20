let hits = 0;

function addHit() {
  hits++;
  const counter = document.getElementById("counter");
  counter.innerHTML = hits;

  counter.classList.add("bump");
  setTimeout(() => counter.classList.remove("bump"), 100);
}
