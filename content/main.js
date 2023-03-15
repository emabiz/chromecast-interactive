
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

  infoMsg('Content version 12');

  window.addEventListener("message", function (event) {
    infoMsg('received message:'+event.data.op+' from '+event.origin);
    switch(event.data.op){
      case 'play':
          video.play();
          break;
      case 'pause':
          video.pause();
          break;
      case 'clear':
        errorElement.innerHTML='';
        break;
  }
});

};
