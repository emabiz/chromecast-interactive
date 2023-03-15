/**
 * Main JavaScript for handling Chromecast interactions.
 */

var applicationID = '2AC895E5';
var namespace = 'urn:x-cast:com.emabiz.chromecast-interactive';
var session = null;

let start=document.querySelector('#start');
let play=document.querySelector('#play');
let pause=document.querySelector('#pause');
let kill=document.querySelector('#kill');

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

function onStopAppSuccess() {
  console.log('onStopAppSuccess');

  kill.prop('disabled', true);
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

function sendMessage(message) {
  if (session != null) {
    session.sendMessage(namespace, message, onSuccess.bind(this, message), onError);
  }
  else {
    console.log('requestSession');
    chrome.cast.requestSession(function(e) {
      console.log('requestSession callback');
      session = e;
      sessionListener(e);
      session.sendMessage(namespace, message, onSuccess.bind(this, message), onError);
    }, onError);
  }
}

function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

function connect() {
  console.log('connect()');
  sendMessage({
    type: 'load',
    url: $('#url').val(),
    refresh: $('#refresh').val(),
  });
}

kill.on('click', stopApp);
