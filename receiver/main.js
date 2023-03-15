
window.onload = function() {

  const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

  const context = cast.framework.CastReceiverContext.getInstance();

  context.addEventListener(cast.framework.system.EventType.READY, () => {
    if (!castDebugLogger.debugOverlayElement_) {
        // Enable debug logger and show a 'DEBUG MODE' overlay at top left corner.
        castDebugLogger.setEnabled(true);
    }
  });


  // cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  castDebugLogger.log('ema','Starting Receiver Manager');

  castReceiverManager.onReady = function(event) {
    castDebugLogger.log('ema','Received Ready event: ' + JSON.stringify(event.data));
    window.castReceiverManager.setApplicationState('chromecast is ready...');
  };

  castReceiverManager.onSenderConnected = function(event) {
    castDebugLogger.log('ema','Received Sender Connected event: ' + event.senderId);
  };

  castReceiverManager.onSenderDisconnected = function(event) {
    castDebugLogger.log('ema','Received Sender Disconnected event: ' + event.senderId);
  };

  window.messageBus =window.castReceiverManager.getCastMessageBus('urn:x-cast:com.emabiz.chromecast-interactive', cast.receiver.CastMessageBus.MessageType.JSON);

  window.messageBus.onMessage = function(event) {
    castDebugLogger.log('ema','Message [' + event.senderId + ']: ' + event.data);
      switch(event.data.op){
          case 'play':
              video.play();
              break;
          case 'pause':
              video.pause();
      }
  }

  // Initialize the CastReceiverManager with an application status message.
  window.castReceiverManager.start({statusText: 'Application is starting'});
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
