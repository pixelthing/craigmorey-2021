
      const cookieRun = () => {
        
        const buildDialog = () => {
          const existingDialogs = document.querySelectorAll('cookies__dialog');
          existingDialogs.forEach((el) => {
            el.remove();
          });
          const dialogEl = document.createElement('dialog');
          dialogEl.classList.add('cookies__dialog');
          const content1 = document.getElementById('cookie-dialog-1').cloneNode(true);
          const content2 = document.getElementById('cookie-dialog-2').cloneNode(true);
          dialogEl.append(content1);
          dialogEl.append(content2);
          dialogEl.querySelector('#dialog-cookie-accept').addEventListener('click', acceptCookie, {passive:true});
          dialogEl.querySelector('#dialog-cookie-reject').addEventListener('click', rejectCookie , {passive:true});
          document.body.append(dialogEl);
        };
        const closeDialog = () => {
          const dialog = document.querySelector('.cookies__dialog');  
          if (!dialog) {
            return;
          }
          
          dialog.innerText = '';
          const newMsg = document.createElement('p');
          newMsg.innerText = 'You can change settings at the foot of the page.';
          dialog.append(newMsg);
          setTimeout(() => {
            dialog.classList.add('cookies__dialog--exit');
            setTimeout(() => {
              dialog.remove();
            }, 200);
          },1500);
        }
        const buildUpdate = () => {
          const existingDialogs = document.querySelectorAll('cookies__dialog');
          existingDialogs.forEach((el) => {
            el.remove();
          });
          const dialogEl = document.createElement('dialog');
          dialogEl.classList.add('cookies__dialog');
          dialogEl.classList.add('cookies__dialog--exit');
          const newMsg = document.createElement('p');
          newMsg.innerText = 'Cookie settings updated.';
          document.body.append(dialogEl);
          dialogEl.append(newMsg);
          setTimeout(() => {
            dialogEl.classList.remove('cookies__dialog--exit');
            setTimeout(() => {
              dialogEl.classList.add('cookies__dialog--exit');
              setTimeout(() => {
                dialogEl.remove();
              }, 200);
            },1000);
          },0);
        };
        
        const toggleCookie = () => {
          if (document.querySelector('#settings-cookie-accept').checked === true) {
            acceptCookie();
          } else {        
            rejectCookie();
          }
          buildUpdate();
        }
        
        const acceptCookie = () => {
          localStorage.setItem('functional.cookieConsent', 'accepted');
          document.querySelector('#settings-cookie-accept').checked = true;
          window.dataLayer.push({
            event: 'cookiesAccepted'
          });
          closeDialog();
        }
        const rejectCookie = () => {
        localStorage.setItem('functional.cookieConsent', 'rejected');
          document.querySelector('#settings-cookie-reject').checked = true;
          closeDialog();
        }
        const init = () => {
          if (!window.dataLayer) {
            window.dataLayer = [];
          }
          document.querySelector('#settings-cookie-accept').addEventListener('change', toggleCookie, {passive:true});
          document.querySelector('#settings-cookie-reject').addEventListener('change', toggleCookie, {passive:true});
          const cookieConsent = localStorage['functional.cookieConsent'];
          if (cookieConsent === 'accepted') {
            acceptCookie();
            return;
          } else if (cookieConsent === 'rejected') {
            rejectCookie();
            return;
          }
          buildDialog(); 
        };
        return {
          init: init()
        }
      }

window.addEventListener('DOMContentLoaded', (event) => {
  cookieRun();
});