const viewportMeasure = () => {
  const measureAndSet = () => {
    var chromeHeight = getAppChromeHeight();
    setAppChromeVar(chromeHeight); 
  }
  const init = () => {
    measureAndSet();
    window.onresize = () => {
      measureAndSet();
    }
  }
  // measure the viewport, vh and browser chrome.
  var getAppChromeHeight = () => {
    const rulerEl = document.createElement('span');
    rulerEl.classList.add('ruler-vh');
    document.body.append(rulerEl);
    const vhHeight = rulerEl.offsetHeight;
    const vpHeight = window.innerHeight;
//    console.log('vhHeight', vhHeight)
//    console.log('vpHeight', vpHeight)
    document.documentElement.style.setProperty('--vp-height', vpHeight + 'px');
    return vhHeight - vpHeight;
  }
  var setAppChromeVar = (cssValue) => {
//    console.log('chrome height', cssValue)
    document.documentElement.style.setProperty('--nav-height', cssValue + 'px');
  }
  return {
    init: init()
  }
};
viewportMeasure();