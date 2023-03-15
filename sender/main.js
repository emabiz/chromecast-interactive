/**
 * Main JavaScript for handling Chromecast interactions.
 */

var applicationID = '2AC895E5';
var namespace = 'urn:x-cast:com.emabiz.chromecast-interactive';
var session = null;

let start=document.querySelector('#cast');
start.addEventListener('click', function(event){
  console.log('connect()');
  chrome.cast.requestSession(function(e) {
      console.log('requestSession callback');
      session = e;
      sessionListener(e);
    }, onError);
});


let play=document.querySelector('#play');
play.addEventListener('click', function(event){
  sendMessage({
    op:'play'
  });
});

let pause=document.querySelector('#pause');
pause.addEventListener('click', function(event){
  sendMessage({
    op:'pause'
  });
});

function sendMessage(message) {
  if(!session){
    return;
  }
  session.sendMessage(namespace, message, onSuccess.bind(this, message), onError);
}

let kill=document.querySelector('#kill');
kill.addEventListener('click', function(event){
  if(!session){
    return;
  }
  session.stop(onStopAppSuccess, onError);
});


function onStopAppSuccess() {
  console.log('onStopAppSuccess');

  kill.prop('disabled', true);
}


if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}

function initializeCastApi() {
  console.log('initializeCastApi',applicationID);
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  console.log('sessionRequest',sessionRequest);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,sessionListener,receiverListener);

  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

function onInitSuccess() {
  console.log('onInitSuccess');
}

function onError(message) {
  console.log('onError: ' + JSON.stringify(message));
}

function onSuccess(message) {
  console.log('onSuccess: ' + JSON.stringify(message));

  if (message.type == 'load') {
      kill.prop('disabled', false);
  }
}


function sessionListener(e) {
  console.log('New session ID: ' + e.sessionId);
  session = e;
  session.addUpdateListener(sessionUpdateListener);
}

function sessionUpdateListener(isAlive) {
  console.log((isAlive ? 'Session Updated' : 'Session Removed') + ': ' + session.sessionId);
  if (!isAlive) {
    session = null;
  }
};

function receiverListener(e) {
  // Due to API changes just ignore this.
}
