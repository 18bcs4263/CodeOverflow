var value = document.ready(function () {
    $('#homePage').click(function () {
            $(this).load('nav.html');
     });
    });
    console.log(value)
//   }).then(res => res.text())
// .then(text => {
//     let oldelem = document.querySelector("script#replace_with_navbar");
//     let newelem = document.createElement("div");
//     newelem.innerHTML = text;
//     oldelem.parentNode.replaceChild(newelem,oldelem);
// })