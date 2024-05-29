import { listenEnter } from "./enterkey.js";
document
  .getElementById("NewGamebtn")
  .addEventListener("click", createnewgame());
document.getElementById("rulesBtn").addEventListener("click", () => {
  $("#rules").toggle();
});
function createnewgame() {
  fetch("/api/newgame/")
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      console.log(data);
      window.location.href = window.location + data.Name;
    });
  //.then((data) => {console.log('wow')})
}

document.getElementById("NewGameName", createnewgame());
