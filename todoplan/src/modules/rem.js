function min (m, n) {
  return (m <= n) ? m : n
}
function getDevice () {
  const UA = window.navigator.userAgent
  const isAndorid = /android/i.test(UA)
  const isIphone = /iphone/i.test(UA)
  const isPad = /ipad/i.test(UA)
  return isAndorid ? 'android' : isIphone ? 'iphone' : isPad ? 'ipad' : 'unknown'
}

function getRem (designWidth, baseSize, varSize, adjust) {
  var html = window.document.getElementsByTagName('html')[0]
  const device = getDevice()
  let actualWidth

  if (device === 'unknown') {
    actualWidth = window.document.body.clientWidth || window.document.documentElement.clientWidth
  } else {
    actualWidth = min(window.screen.width, window.screen.height)
  }
  html.style.fontSize = (baseSize + actualWidth / designWidth * varSize + adjust) + 'px'
}

export default getRem
