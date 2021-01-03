console.log('hi!');

var detectOverflow = (pageId) => {
  if (!document.querySelector('body').classList.contains('mag')) {
    console.error(`MAG LAYOUT NOT SET-UP`); 
    return;
  }
  console.log('*** page' + pageId , '-----')
  var maxPages = 20;
  if (pageId > maxPages) {
    console.error(`MAX ${maxPages} PAGES!`);
    return;
  }
  // grab the paras in the target page
  var prePage = document.querySelector('#page' + pageId);
  var prePageNodes = prePage.querySelectorAll('*');
  var prePageNodesLength = prePageNodes.length;
  console.log('*** page' + pageId, 'prePageNodes', prePageNodes.length)
  // get the page height (determined by CSS)
  var prePageMetrics = prePage.getBoundingClientRect();
  var prePageRight = prePageMetrics.right;
  var prePageBottom = prePageMetrics.bottom;
  console.log('*** page' + pageId, 'container width/height', prePageRight, prePageBottom);
  // create a new page, ready for any overflow paras
  var newPage = document.createElement('div');
  var newPageId = pageId + 1;
  newPage.id = 'page' + newPageId;
  newPage.classList.add('page');
  // construct a list of paras to move into next page
  var overflowFound = 0;
  for(let i = 0; i < prePageNodesLength; i++) {
    var el = prePageNodes[i];
    if (!el || (el.tagName === 'A' && el.innerText === '#')) {
      continue;
    }
    var elMetrics = el.getBoundingClientRect();
    var elRight = elMetrics.right;
    var elBottom = elMetrics.bottom
    if (!overflowFound && elRight > prePageRight) {      
      console.log('*** page' + pageId, 'el dims', el.tagName, el.innerText.substr(0,5), elRight, elBottom, overflowFound)
      overflowFound = i;
    }
    if (overflowFound) {
      // add to the next page
      newPage.appendChild(el.cloneNode(true));
    }
  };
  if (!overflowFound) {
    console.log('*** page' + pageId, 'COMPLETE')
    return;
  }
  prePage.after(newPage)
  console.log('*** page' + pageId, '-----', overflowFound, prePageNodesLength)
  // remove from the previous page
  for(let i = prePageNodesLength-1; i >= overflowFound; i--) {
    var el = prePageNodes[i];
    try {
      prePage.removeChild(el);
    } catch (err) {
      console.error('*** page' + pageId + ' ERROR', i, prePageNodesLength, err, el.tagName, el.innerText.substr(0,5))
    }
  }
  // run on this latest para to see if extra pages need to be created
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      detectOverflow(newPageId); 
    });  
  });
}

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
      detectOverflow(1); 
      })
    });  
  });