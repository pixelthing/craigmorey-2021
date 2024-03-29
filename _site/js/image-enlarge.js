const imageEnlarge = () => {
  const init = () => {
    registerEvents(); 
  };
  
  const registerEvents = () => {
    const links = document.querySelectorAll('.post__link');
    links.forEach(el => {
      el.addEventListener('click', linkHandler);
    });
  };
  
  // get ready to close modal
  const modalClose = (ev,immediate) => {
    const existingModal = document.querySelector('.modal');
    if (existingModal && immediate) {
      existingModal.remove();
    } else if (existingModal) {
      existingModal.classList.add('modal--initial');
      setTimeout(() => {
        existingModal.remove();
      },310);
    }
  }
  
  const modalOpen = (picUrl, anchorUrl, anchorWidthSource, anchorHeightSource) => {

    console.log('model open')
    
    // create the modal, fill with the existing image
    const modalInner = `
      <div class="modal__inner" style="--imgHeight: ${anchorHeightSource}px">
        <img src="${picUrl}" width="${anchorWidthSource}" height="${anchorHeightSource}" alt="enlarged version" class="modal__img"/>
        <button class="modal__close">close</button>
        <span class="modal__spinner">loading</span>
      </div>
      <div class="modal__background"></div>
    `;
    const modal = document.createElement('dialog');
    modal.classList.add('modal');
    modal.classList.add('modal--initial');
    modal.innerHTML = modalInner;
    document.body.append(modal);
    // add event handlers
    modal.querySelector('.modal__close').addEventListener('click', modalClose);
    modal.querySelector('.modal__background').addEventListener('click', modalClose);
    // kickoff download to source image / to replace the exsiting image
    const imgLoadedHandler = () => {
      modal.querySelector('.modal__img').src = anchorUrl;
      modal.querySelector('.modal__spinner').remove();
    };
    var imgSource = new Image();
    imgSource.addEventListener('load', imgLoadedHandler, false)
    imgSource.src = anchorUrl;
    modal.showModal();
    // animation
    setTimeout(() => {
      modal.classList.remove('modal--initial');
    },0);
  }  
  
  const linkHandler = ev => {
    ev.preventDefault();
    const anchorClicked = ev.target.closest('a');
    const anchorImg = anchorClicked.querySelector('img');
    const anchorWidthOnScreen = anchorImg.clientWidth;
    const anchorWidthSource = parseInt(anchorImg.getAttribute('width'));
    const anchorHeightSource = parseInt(anchorImg.getAttribute('height'));
    const anchorUrl = anchorClicked.href;
    const picCloned = anchorClicked.childNodes[0].cloneNode(true);
    const picUrl = anchorClicked.querySelector('img').currentSrc;

    console.log(anchorUrl)
    // if the source image is no bigger than the one we see, say so & exit
    if (anchorWidthSource <= anchorWidthOnScreen) {
      alert('There is no larger version of this image to view.');
      return;
    }
    // kill all current modals
    modalClose(false,true);
    // open new model
    modalOpen(picUrl, anchorUrl, anchorWidthSource, anchorHeightSource);
    
  }
  
  return {
    init: init()
  }
};
imageEnlarge();