const postTitleSticky = () => {
  
  let   titleTimeout;
  
  const init = () => {
    if (!document.querySelector('.tmpl-post')) {
      return;
    }
    observer();
  }

  const observer = () => {
    console.log('post title scroll observer started');
    var intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = document.querySelector('.post-title-scrolled__inner');
        // orig title visible
        if (entry.intersectionRatio > 0.1) {
          target.classList.remove('post-title-scrolled__inner--active');
          titleTimeout = setTimeout(() => {
            target.innerText = '';
          }, 500);
        // orig title disappeared
        } else {
          clearTimeout(titleTimeout);
          target.innerText = entry.target.innerText;
          target.classList.add('post-title-scrolled__inner--active');
        }
      });
    }, {
      threshold: [0.1] 
    });
    // start observing
    intersectionObserver.observe(document.querySelector('#page1 h1'));
  };
  
  return {
    init: init()
  }
}
postTitleSticky();