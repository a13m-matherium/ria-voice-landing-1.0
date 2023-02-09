
// code for text blinking through the list of uses

const text = ["Lead Qualification.", "Sales.", "Customer Support."];
let counter = 0;
const elem = document.getElementById("changeText");
setInterval(change, 2500);

function change() {
    if (elem.classList.contains('show')){
        elem.classList.remove('show');
    }
    elem.classList.add('hide');
    setTimeout(function () {
        elem.innerHTML = text[counter];
        elem.classList.remove('hide');
        elem.classList.add('show');
        counter++;
        if (counter >= text.length) {
            counter = 0;
        }        
    }, 1500);   
}

// code for playing the video when it's in view and pausing it when it's not

const mediaQuery = window.matchMedia('screen and (max-width: 600px)');
const video2 = document.querySelector("#video2");


if (!mediaQuery.matches) {
  const observer = new IntersectionObserver(function(entries) {
    if(entries[0].isIntersecting === true)
      video2.play();
      else
          video2.pause();
  }, { threshold: [1] });
  
  observer.observe(video2);
}


// Success toast

document.getElementById("email-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // important for preventing reloading afetr fetching ie default behavior
    const email = document.getElementById("email").value
    await fetch("/emailupdate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
      })
    }).then(() => {
      document.getElementById('email').value='';
      showSuccessToast();
      })
      .catch((error) => alert(error));;
});

function showSuccessToast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// toggle menu list for mobile screen navbar

function toggleMenuList() {
  const x = document.getElementById("mobile-nav");
  if (x.style.display == 'none'){
    x.style.display = 'block';
    x.style.opacity = 1;
  }
  else{
    x.style.display = 'none';
    x.style.opacity = 0;
  }
   

  const arrow = document.getElementById("arrow");
  if (arrow.className === "fa-solid fa-angle-down") {
    arrow.className = "fa-solid fa-angle-up";
  } else {
    arrow.className = "fa-solid fa-angle-down";
  }
}
