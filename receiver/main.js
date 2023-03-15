
window.onload = function() {
  window.location.href = "https://www.repubblica.it/index.html";
  return;
  let  errorElement = document.querySelector('#errorMsg');
  let video=document.querySelector('#video');
  let button=document.querySelector('#button');
  button.addEventListener('click', function(event){
    infoMsg('start play with audio');
    video.play();
  });

  infoMsg('Application version 7');
  infoMsg('UserAgent: '+window.navigator.userAgent );

  const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

  const context = cast.framework.CastReceiverContext.getInstance();

  context.addEventListener(cast.framework.system.EventType.READY, () => {
    infoMsg('Ready');
    if (!castDebugLogger.debugOverlayElement_) {
        // Enable debug logger and show a 'DEBUG MODE' overlay at top left corner.
        castDebugLogger.setEnabled(true);
        // Show debug overlay
      castDebugLogger.showDebugLogs(true);
      // Clear log messages on debug overlay
      castDebugLogger.clearDebugLogs();
    }
    castDebugLogger.info('ema','Received Ready event: ' + JSON.stringify(event.data));
    context.setApplicationState('chromecast is ready...');
  });

  castDebugLogger.info('ema','Starting Receiver Manager');

  context.addEventListener(cast.framework.system.EventType.SENDER_CONNECTED,function(event) {
    infoMsg('Sender Connected');
    castDebugLogger.info('ema','Received Sender Connected event: ' + event.senderId);
  });

  context.addEventListener(cast.framework.system.EventType.SENDER_DISCONNECTED,function(event) {
    infoMsg('Sender Disconnected');
    castDebugLogger.info('ema','Received Sender Disconnected event: ' + event.senderId);
  });

  context.addCustomMessageListener('urn:x-cast:com.emabiz.chromecast-interactive', function(event) {
    castDebugLogger.info('ema',event);
    infoMsg('Received message',event.data.op);
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


  context.start({statusText: 'Application is starting'});
  castDebugLogger.info('ema','Receiver Manager started');


  function infoMsg(msg) {
    errorElement.innerHTML += `<p>${msg}</p>`;
  }

};
