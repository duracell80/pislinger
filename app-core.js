global_disp_vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
global_disp_vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);


function init() {
    

    var videocanvas     = document.getElementById("videocanvas");
    var maincanvas      = document.getElementById("main");   
    
    // Check ability to play videowallpaper    
    if (videocanvas.canPlayType("video/webm").length > 0) {
        // Check display size, 
        // Thin devices may not handle video wallpapers well        
        if(global_disp_vw > 1000) {          
            videocanvas.src                         = "videowallpaper.webm";        
        }
    } 
}







function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}







function togglescreen(target) {
  var elem          = window.parent.document.getElementById(target);
  var statusbar     = window.parent.document.getElementById("status");
  var screenstatus  = window.parent.document.getElementById("screenstatus");

  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }

    statusbar.style.display = "block";
    screenstatus.textContent = "fullscreen_exit";
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    
    statusbar.style.display = "none";
    screenstatus.textContent = "fullscreen";
  }
}







function frameload(){
    var frameObj = document.getElementById('appcanvas');
    var frameSrc = frameObj.src;
    var frameLoaded = 0;
    
    
    try {
        var frameContent = frameObj.contentWindow.document.body.innerHTML;
        
        if (frameContent.indexOf("div") > -1) {
            frameLoaded = 1;
        } else {
            frameLoaded = 0;        
        }
    }
    catch(err) {
        frameLoaded = -1;
    } finally {
      
    }

    
}






function launchapp(appurl) {
        var iframeLoaded = false;
        var iframe = document.createElement('iframe');
        var splash = window.parent.document.getElementById("splash"); 
        
        iframe.src          = appurl;
        iframe.id           = "apptester";
        iframe.className    = "apptester";
        
        splash.style.height     = "100vh";        
        splash.style.opacity    = "1";        
        document.body.appendChild(iframe);
           
        
        
        var iframeOnloadEvent   = function () {
            iframeLoaded        = true;
                   
            
            if (iframe.contentWindow.length > 0) {
                // CAN LOAD
                window.parent.document.getElementById("appcanvas").src=iframe.src;
                sleep(2000);                
                splash.style.opacity    = "0";
                splash.style.height     = "0vh";
                setTimeout(function() { 
                    document.getElementById("apptester").remove();
                }, 2000);  
            } else {
                // CAN'T LOAD HANDLE ERRORS
                splash.style.opacity = "0";
                splash.style.height  = "0vh";                   
                window.parent.document.getElementById("appcanvas").src="./fallback.html?url="+iframe.src;

                setTimeout(function() { 
                            document.getElementById("apptester").remove();
                        }, 2000); 
            }
        } 

        if (iframe.attachEvent){
            iframe.attachEvent('onload', iframeOnloadEvent);
        } else {
            iframe.onload = iframeOnloadEvent;
        }
        
           
    
}


function launchpage(pageurl) {
    window.parent.document.getElementById("appcanvas").src=pageurl;
}


function launchsidebar(appurl) {
    var sidecontainer    = window.parent.document.getElementById("sidebar");
    var sidecanvas       = window.parent.document.getElementById("appsidebar");
    var maincanvas       = window.parent.document.getElementById("appcanvas");    

    maincanvas.style.width  = "65%";
    sidecanvas.src=appurl;
    setTimeout(function() { 
            sidecontainer.style.display = "block";
    }, 2000); 
    
}

function sidebarctrl(cmd) {
    var sidecontainer    = window.parent.document.getElementById("sidebar");
    var sidecanvas       = window.parent.document.getElementById("appsidebar");
    var maincanvas       = window.parent.document.getElementById("appcanvas");    

       
    if (cmd == "toggle"){
        if (sidecontainer.style.display != "none") {
            sidecontainer.style.height = "none";
            maincanvas.style.width  = "100%";
        } else {
            sidecontainer.style.height = "block";
            maincanvas.style.width  = "65%";    
        }
    }
    
    if (cmd == "close"){
        sidecanvas.src = "";
        sidecontainer.style.display = "none";
        maincanvas.style.width  = "100%";
    }
    
}


function customaud() {
    var audiosearc        = document.getElementById("audiosearch").value; 
    launchaud(audiourl);
}

function launchpod(podurl) {
    var cproxy  = "https://cors-anywhere.herokuapp.com/";
    var corsurl = cproxy + podurl;
    //var obj = {
      //mode : 'no-cors'
    //};

    var obj = {
      headers: {
        'origin': 'http://localhost'
      }
    };


    fetch(podurl, obj)    
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const items = data.querySelectorAll("item");
        launchaud(items[0].querySelector("enclosure").getAttribute("url"));
      }).catch((error) => {
        alert("Error: Failed to fetch podcast, CORS may need to be disabled.");
    });
}


function launchaud(audiourl) {
    var audioplayer = window.parent.document.getElementById("audioplayer");    
    var audiomp3    = window.parent.document.getElementById("audiomp3");
    
    if(audiourl != ""){
        audiomp3.src = audiourl;
        audioctrl("play");   
        
    } else {
        window.parent.document.getElementById("appcanvas").src="./audiostream.html";    
    }
    
}

function delaunchaud(source) {
    var audiomp3 = window.parent.document.getElementById("audiomp3");
    audioctrl("stop");
    audiomp3.src = "";
    audioctrl("load");
}


function audioctrl(cmd) {
    var audioplayer     = window.parent.document.getElementById("audioplayer");
    var audiostatus     = window.parent.document.getElementById("audiostatus");
    var audiocontainer  = window.parent.document.getElementById("audio");
    var audioui         = window.parent.document.getElementById("audioui");
    var audioskip       = window.parent.document.getElementById("audioskip");

    
    if (audioplayer.paused) {
        audiostatus.textContent = "Ply";
    } else {
        audiostatus.textContent = "Pau"; 
    }
          
    if (cmd == "play") {       
        audiocontainer.style.display = "block";        
        setTimeout(function() { 
                audioplayer.setAttribute("controls", "");
        }, 2000);        
        
        audioplayer.load();        
        audioplayer.oncanplay = function() {
            
            audiostatus.textContent = "Pau";
            audioplayer.style.opacity = "1";            
            audiocontainer.style.width = "480px";
            audioui.textContent = "Min";            
            audioplayer.style.width = "250px";

        };        

        audioplayer.play();
        
        
        audioplayer.onstalled = function() {
            alert("Playback: Please check your connection.");
        };
        
        
    }

    if (cmd == "pause"){        
        audioplayer.pause();
        audiostatus.textContent = "Ply";
    }


    if (cmd == "skip30"){             
        if(audioplayer.seekable.end(0) != "Infinity"){        
            if (audioplayer.paused) {
                audioplayer.play();
                audiostatus.textContent = "Pau";
            }
            var audiocurrent    = audioplayer.currentTime;
            var audioseek       = audiocurrent + 30;
            audioplayer.currentTime = audioseek;
        } else {
            alert('Playback: Stream not seekable');
            //audioskip.display = "none";
        }
    }

    if (cmd == "stop"){        
        audioplayer.style.width = "0px";
        audioplayer.style.opacity = "0";
        
        audioui.textContent = "Max";            
        audiocontainer.style.width = "165px";
        
        setTimeout(function() { 
            audioplayer.pause();           
            audioplayer.removeAttribute("controls");
        }, 2000);
        
    }

    if (cmd == "load"){        
        audioplayer.load();
    }

    if (cmd == "switch"){
        if (audioplayer.paused) {
            audioplayer.play();
            audiostatus.textContent = "Pau";
        } else {
            audioplayer.pause();
            audiostatus.textContent = "Ply";

        }
    }

    if (cmd == "controls"){
        audioplayer.toggleAttribute("controls");
    }

    if (cmd == "toggle"){
        if (audiocontainer.style.width != "165px") {
            audioplayer.style.width = "0px";
            audioplayer.style.opacity = "0";
            
            audioui.textContent = "Max";            
            audiocontainer.style.width = "165px";
            
            setTimeout(function() { 
               audioplayer.removeAttribute("controls");
            }, 2000);
        
         
        } else {
            audioplayer.setAttribute("controls", "");            
            setTimeout(function() {
                audioplayer.style.opacity = "1";            
                audiocontainer.style.width = "480px";
                audioui.textContent = "Min";            
                audioplayer.style.width = "250px";
            }, 250); 
             
        }
    }

    if (cmd == "close"){
        if (!audioplayer.paused) {        
            audioplayer.pause();
        }
        delaunchaud("mp3");
        audiocontainer.style.display = "none";
    }
    
    
}


function launchpip(pipurl) {
        
        var pip             = window.parent.document.getElementById("pipcanvas");
        var pipcontainer    = window.parent.document.getElementById("pip");

        pip.src             = pipurl;
        pip.className       = "pipcanvas";
        pipcontainer.style.display = "block";

        var iframeOnloadEvent   = function () {
            
            // YOUTUBE
            if(pipurl.includes("youtube")){
                pip.setAttribute("allow", "autoplay; clipboard-write; encrypted-media;");
            }

            var audioplayer     = window.parent.document.getElementById("audioplayer");
            var audiostatus     = window.parent.document.getElementById("audiostatus");
            var audiocontainer  = window.parent.document.getElementById("audio");

            if (!audioplayer.paused) {
                audioplayer.removeAttribute("controls");                
                
                //audiostatus.textContent = "Play";
                //audiocontainer.style.width = "165px";
                               
                //audioplayer.pause();
                audioctrl("stop");
                
            }     

            
        } 

        if (pip.attachEvent){
            pip.attachEvent('onload', iframeOnloadEvent);
        } else {
            pip.onload = iframeOnloadEvent;
        }          
    
 }






function pipctrl(cmd) {
    var pipcontainer    = document.getElementById("pip");
    var pipcanvas       = document.getElementById("pipcanvas");   
    
    if (cmd == "toggle"){
        if (pipcontainer.style.height != "30px") {
            pipcontainer.style.height = "30px";
        } else {
            pipcontainer.style.height = "350px";    
        }
    }
    
    if (cmd == "close"){
        //pipcanvas.remove();
        pipcanvas.src = "";
        pipcontainer.style.display = "none";

    }
    
}



function appsload() {
    window.document.getElementById("wrapper").style.opacity = "1";
}



function loadhome() {
    window.document.getElementById("appcanvas").src="./launcher.html";
}





function checkeys(evt) {
    evt = evt || window.event;
    
    if (evt.keyCode === 17) { audioctrl('switch'); }
    
};


