
window.onload = function() {
  let  errorElement = document.querySelector('#errorMsg');
  let video=document.querySelector('#video');
  let button=document.querySelector('#button');
  button.addEventListener('click', function(event){
    infoMsg('start play with audio');
    video.play();
  });

  function infoMsg(msg) {
    errorElement.innerHTML += `<p>${msg}</p>`;
  }

};
