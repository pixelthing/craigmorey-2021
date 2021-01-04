const magazine = function() {

  console.log('magazine js loaded!');
  
  var intersectionObserver;

  const init = () => {
    // run a media query to check for magazine layout compatibility
    const mq = window.matchMedia( "(min-width: 40em) and (min-height: 20rem)" );
    // to enable magazine layout, the viewport needs to pass the above media query 
    // and have the ".mag" class on the body
    if (mq.matches && document.querySelector('body').classList.contains('mag')) {
      console.log(`MAG SET-UP`);
      initPageCounter();
      flowText(1, observer);
    // if we are not running magazine layout, you might need to strip 
    // magazine layout stuff out
    } else {
      // remove intersection observers
      if (intersectionObserver) {
        document.querySelectorAll('.page').forEach(el => { intersectionObserver.unobserve(el) });
      }
      // amalagamate all pages into the first page
      const pages = document.querySelectorAll('.page');
      if (pages.length > 1) {
        console.log('was prevously mag layout')
        const page1 = pages[0];
        
      }
    }
  }


const flowText = (pageId,callBack) => {
  console.log('*** page' + pageId , '-----')
  const maxPages = 50;
  if (pageId > maxPages) {
    console.error(`MAX ${maxPages} PAGES!`);
    return;
  }
  // grab the paras in the target page
  const prePage = document.querySelector('#page' + pageId);
  const prePageNodes = prePage.children;
  const prePageNodesLength = prePageNodes.length;
  console.log('*** page' + pageId, 'prePageNodes', prePageNodes.length)
  // get the page height (determined by CSS)
  const prePageMetrics = prePage.getBoundingClientRect();
  const prePageRight = prePageMetrics.right;
  const prePageBottom = prePageMetrics.bottom;
  console.log('*** page' + pageId, 'container width/height', prePageRight, prePageBottom);
  // create a new page, ready for any overflow paras
  const newPage = document.createElement('div');
  const newPageId = pageId + 1;
  newPage.id = 'page' + newPageId;
  newPage.classList.add('page');
  // construct a list of paras to move into next page
  let   overflowFound = 0;
  for(let i = 0; i < prePageNodesLength; i++) {
    const el = prePageNodes[i];
    if (!el || (el.tagName === 'A' && el.innerText === '#')) {
      continue;
    }
    const elMetrics = el.getBoundingClientRect();
    const elRight = elMetrics.right;
    const elBottom = elMetrics.bottom
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
    // add the counter total
    document.querySelector('.mag-counter__total').innerText = pageId;
    document.querySelector('.mag-counter').classList.add('mag-counter--active');
    console.log('*** page' + pageId, 'COMPLETE');
    callBack();
    return;
  }
  prePage.after(newPage);
  
  // add to the page counter
  const counter = document.createElement('span');
  counter.innerText = pageId + 1;
  document.querySelector('.mag-counter__current__inner').append(counter);
  console.log('*** page' + pageId, '-----', overflowFound, prePageNodesLength)
  // remove from the previous page
  for(let i = prePageNodesLength-1; i >= overflowFound; i--) {
    const el = prePageNodes[i];
    try {
      prePage.removeChild(el);
    } catch (err) {
      console.error('*** page' + pageId + ' ERROR', i, prePageNodesLength, err, el.tagName, el.innerText.substr(0,5))
    }
  }
  // run on this latest para to see if extra pages need to be created.
  // Double RAF it to push the next batch of measurements 
  // into the next frame budget.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      flowText(newPageId, callBack); 
    });  
  });
}

  const initPageCounter = () => {
    const counterContainer = document.createElement('div');
    counterContainer.classList.add('mag-counter');
    const counterCurrent = document.createElement('span');
    counterCurrent.classList.add('mag-counter__current');
    const counterCurrentTrack = document.createElement('span');
    counterCurrentTrack.classList.add('mag-counter__current__inner');
    const counterCurrentPage1 = document.createElement('span');
    counterCurrentPage1.innerText = 1
    const counterDelim = document.createElement('span');
    counterDelim.classList.add('mag-counter__delim');
    counterDelim.innerText = 'of';
    const counterTotal = document.createElement('span');
    counterTotal.classList.add('mag-counter__total');
    counterTotal.innerText = 'x';
    counterCurrentTrack.append(counterCurrentPage1);
    counterCurrent.append(counterCurrentTrack);
    counterContainer.append(counterCurrent);
    counterContainer.append(counterDelim);
    counterContainer.append(counterTotal);
    document.querySelector('header').append(counterContainer);
  };

  const observer = () => {
    console.log('magazine observer started');
    intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0.5) {
          // update the page counter
          const pageId = entry.target.id;
          const pageNumber = parseInt(pageId.substr(-1));
          document.querySelector('.mag-counter__current__inner').style.transform = `translateY(-${(pageNumber - 1)}em)`;              
        }
      });
    }, {
      threshold: [0.51] 
    });
    // start observing
    document.querySelectorAll('.page').forEach(el => { intersectionObserver.observe(el) });
  };
  
  return {
    init: init()
  }
}
magazine();