function log() {
  var args = Array.prototype.slice.call(arguments);
  const messageString = args.join(' ');

  console.log('[READYJS]', messageString);

  if (window.self !== window.top) {
    window.parent.postMessage({
      action: 'log',
      message: messageString
    }, '*')
  }
}
