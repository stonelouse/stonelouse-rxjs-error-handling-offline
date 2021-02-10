import { Subject, throwError, interval, NEVER } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap, map, take, catchError } from "rxjs/operators";

// Import stylesheets
// import "./style.css";

console.clear();

const onlineDiv = document.getElementById("online");
console.log({ onlienDiv: onlineDiv });
let isOnline = true;
document.getElementById("toggleNetwork").addEventListener("click", () => {
  isOnline = !isOnline;
  online$.next(isOnline);
  onlineDiv.innerText = "Online: " + isOnline;
});

const online$ = new Subject();

function fetchPikachu(index) {
  if (index === 5 || !isOnline) {
    return throwError("error!");
  }
  return ajax("https://pokeapi.co/api/v2/pokemon/pikachu");
}

interval(1000)
  .pipe(
    switchMap((_, index) => fetchPikachu(index)),
    catchError(_ => NEVER),
    map(e => e.response),
    map(char => char.name),
    take(10)
  )
  .subscribe(console.log, console.log);
