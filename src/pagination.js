console.log('hi!');

var toNodeList = function(arrayOfNodes){
  var fragment = document.createDocumentFragment();
  arrayOfNodes.forEach(function(item){
    fragment.appendChild(item.cloneNode(true));
  });
  return fragment.childNodes;
};

var detectOverflow = (pageId) => {
  console.log('*** page' + pageId)
  var prePage = document.querySelector('#page' + pageId);
  var prePageNodes = prePage.querySelectorAll('*');
  var prePageArray = Array.from(prePageNodes);
  console.log('*** page' + pageId, 'prePageNodes', prePageNodes.length)
  var prePageWidth = prePage.offsetWidth;
  var prePageHeight = prePage.offsetHeight;
  console.log('*** page' + pageId, 'container width/height', prePageWidth, prePageHeight);
  var indexesMoved = [];
  var nextPageArray = prePageArray.filter((el, i) => {
      console.log('*** page' + pageId, 'el width/height', el.tagName, el.innerText.substr(0,5), el.offsetLeft + el.offsetWidth, el.offsetTop + el.offsetHeight, el.offsetLeft + el.offsetWidth > prePageWidth || el.offsetTop + el.offsetHeight > prePageHeight)    
    if (el.offsetLeft + el.offsetWidth > prePageWidth || el.offsetTop + el.offsetHeight > prePageHeight) {
     indexesMoved.push(i);
     return true; 
    }
  });
  var nextPageNodes = toNodeList(nextPageArray);
  console.log('*** page' + pageId, 'nextPageArray', nextPageArray.length, indexesMoved);
  if (!nextPageArray.length) {
    console.log('*** page' + pageId, 'finished');
    return;
  }
  var newPage = document.createElement('div');
  var newPageId = pageId + 1;
  newPage.id = 'page' + newPageId;
  newPage.classList.add('page');
  nextPageNodes.forEach((el) => {
    newPage.appendChild(el);
  });
  prePage.after(newPage);
  // run on this latest para
  if (nextPageArray.length > 1) {
    detectOverflow(newPageId);
  } 
}
detectOverflow(1);