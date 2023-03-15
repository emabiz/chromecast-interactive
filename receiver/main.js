
window.onload = function() {

  const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

  const context = cast.framework.CastReceiverContext.getInstance();

  context.addEventListener(cast.framework.system.EventType.READY, () => {
    castDebugLogger.log('ema','Received Ready event: ' + JSON.stringify(event.data));
    context.setApplicationState('chromecast is ready...');
    if (!castDebugLogger.debugOverlayElement_) {
        // Enable debug logger and show a 'DEBUG MODE' overlay at top left corner.
        castDebugLogger.setEnabled(true);
    }
  });

  castDebugLogger.log('ema','Starting Receiver Manager');

  context.addEventListener(cast.framework.system.EventType.SENDER_CONNECTED,function(event) {
    castDebugLogger.log('ema','Received Sender Connected event: ' + event.senderId);
  });

  context.addEventListener(cast.framework.system.EventType.SENDER_DISCONNECTED,function(event) {
    castDebugLogger.log('ema','Received Sender Disconnected event: ' + event.senderId);
  });

  context.addCustomMessageListener('urn:x-cast:com.emabiz.chromecast-interactive', function(event) {
    castDebugLogger.log('ema',event);
      switch(event.data.op){
          case 'play':
              video.play();
              break;
          case 'pause':
              video.pause();
      }
  });


  context.start({statusText: 'Application is starting'});
  castDebugLogger.log('ema','Receiver Manager started');


  function infoMsg(msg) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
  }

  let video=document.querySelector('#video');
  video.play();
  let button=document.querySelector('#button');

  button.addEventListener('click', function(event){
    infoMsg('start play with audio');
    video.play();
  });
};
