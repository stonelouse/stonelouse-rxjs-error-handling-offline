import { Subject, throwError, interval, NEVER, fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap, map, take, catchError, retryWhen } from "rxjs/operators";

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
  console.log("switched to " + (isOnline ? "online" : "offline"));
});

const online$ = new Subject();

function fetchPikachu(index) {
  if (index === 5 || !isOnline) {
    console.log("fetchPikachu() throws an error");
    return throwError("error!");
  }
  return ajax("https://pokeapi.co/api/v2/pokemon/pikachu");
}

/* --------------------------------------------------------
  The Observable chain is broken after the 6th fetch
 */
// interval(1000)
//   .pipe(
//     switchMap((_, index) => fetchPikachu(index)),
//     catchError(_ => NEVER),
//     map(e => e.response),
//     map(char => char.name),
//     take(10)
//   )
//   .subscribe(console.log, console.log);

/* --------------------------------------------------------
  To keep the fetching of data alive we have to make sure 
  that errors never happen on the main Observable chain.
 */
// interval(1000)
//   .pipe(
//     switchMap((_, index) => fetchPikachu(index).pipe(catchError(_ => NEVER))),
//     map(e => e.response),
//     map(char => char.name),
//     take(10)
//   )
//   .subscribe(console.log, console.log);

/* --------------------------------------------------------
  To keep the fetching of data alive we have to make sure 
  that errors never happen on the main Observable chain.
  Retry when the app is online again
 */
interval(1000)
  .pipe(
    switchMap((_, index) => fetchPikachu(index).pipe(catchError(_ => NEVER))),
    map(e => e.response),
    map(char => char.name),
    take(10),
    /* Retry when the app is online again */
    // retryWhen(() => fromEvent(window, "online"))
    /* ... simulate this situation by a Subject */
    retryWhen(() => online$)
  )
  .subscribe(console.log, console.log);
