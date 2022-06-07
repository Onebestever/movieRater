
// // const thumbUp = document.getElementsByClassName("fa-thumbs-up");
let thumbUp = document.getElementsByClassName("fa-thumbs-up");
let thumbDown = document.getElementsByClassName("fa-thumbs-down");
let trash = document.getElementsByClassName("fa-trash-o");

// const addCareBtn = document.getElementsByClassName('addCareBtn')

// const seeCareBtn = document.getElementsByClassName('seeCareBtn')

// const updateForm = document.getElementsByClassName('updateForm')
// const plantMain = document.getElementsByClassName('plantMain')




Array.from(thumbUp).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    console.log('sending movie name to Server', name)
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('/movies', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'thumbUp':thumbUp
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(thumbDown).forEach(function(element) {
element.addEventListener('click', function(){
const name = this.parentNode.parentNode.childNodes[1].innerText
const msg = this.parentNode.parentNode.childNodes[3].innerText
const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
fetch('moviesTDown', {
  method: 'put',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    'name': name,
    'msg': msg,
    'thumbUp':thumbUp
  })
})
.then(response => {
  if (response.ok) return response.json()
})
.then(data => {
  console.log(data)
  window.location.reload(true)
})
});
});


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    // const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('movies', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});


// // Array.from(thumbUp).forEach(function(element) {
// //       element.addEventListener('click', function(){
// //         const name = this.parentNode.parentNode.childNodes[1].innerText
// //         const msg = this.parentNode.parentNode.childNodes[3].innerText
// //         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
// //         fetch('movies', {
// //           method: 'put',
// //           headers: {'Content-Type': 'application/json'},
// //           body: JSON.stringify({
// //             'name': name,
// //             'msg': msg,
// //             'thumbUp':thumbUp
// //           })
// //         })
// //         .then(response => {
// //           if (response.ok) return response.json()
// //         })
// //         .then(data => {
// //           console.log(data)
// //           window.location.reload(true)
// //         })
// //       });
// // });

// // Array.from(thumbDown).forEach(function(element) {
  // //   element.addEventListener('click', function(){
    // //     const name = this.parentNode.parentNode.childNodes[1].innerText
// //     const msg = this.parentNode.parentNode.childNodes[3].innerText
// //     const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
// //     fetch('moviesTDown', {
// //       method: 'put',
// //       headers: {'Content-Type': 'application/json'},
// //       body: JSON.stringify({
// //         'name': name,
// //         'msg': msg,
// //         'thumbUp':thumbUp
// //       })
// //     })
// //     .then(response => {
// //       if (response.ok) return response.json()
// //     })
// //     .then(data => {
// //       console.log(data)
// //       window.location.reload(true)
// //     })
// //   });
// // });



