// var promise1 = Promise.resolve(3);
// var promise2 = 42;
// var promise3 = new Promise(function(resolve, reject) {
//   setTimeout(resolve, 100, 'foo');
// });

// Promise.all([promise1, promise2, promise3]).then(function(values) {
//   console.log(values);
// });
// // expected output: Array [3, 42, "foo"]

var p1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'one');
});
var p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, 'two');
});
var p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 3000, 'three');
});
var p4 = new Promise((resolve, reject) => {
    setTimeout(resolve, 4000, 'four');
});
// var p5 = new Promise((resolve, reject) => {
//     reject('reject');
// });

Promise.all([p1, p2, p3, p4]).then(values => {
    console.log(values);
}, reason => {
    console.log(reason)
});

//From console:
//"reject"

//You can also use .catch
Promise.all([p1, p2, p3, p4]).then(values => {
    console.log(values);
}).catch(reason => {
    console.log(reason)
});

  //From console: 
  //"reject"