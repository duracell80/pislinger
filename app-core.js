function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
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
        
        iframe.src = appurl;
        iframe.className = "apptester";
        
        splash.style.height     = "100vh";        
        splash.style.opacity    = "1";        
        document.body.appendChild(iframe);
           
        
        
        var iframeOnloadEvent   = function () {
            iframeLoaded        = true;
            sleep(1000);         
            
            if (iframe.contentWindow.length > 0) {
                // CAN LOAD
                window.parent.document.getElementById("appcanvas").src=iframe.src;
                sleep(5000);                
                splash.style.opacity    = "0";
                splash.style.height     = "0vh";  
            } else {
                // CAN'T LOAD HANDLE ERRORS
                splash.style.opacity = "0";
                splash.style.height  = "0vh";                   
                window.parent.document.getElementById("appcanvas").src="./fallback.html?url="+iframe.src;
            }
        } 

        if (iframe.attachEvent){
            iframe.attachEvent('onload', iframeOnloadEvent);
        } else {
            iframe.onload = iframeOnloadEvent;
        }
         
    
 }



function audioctrl(cmd) {
    var audioplayer     = document.getElementById("audioplayer");
    var audiostatus     = document.getElementById("audiostatus");
      
    if (cmd == "play"){
        audioplayer.play();
    }

    if (cmd == "pause"){
        audioplayer.pause();
    }

    if (cmd == "switch"){
        if (audioplayer.paused) {
            audioplayer.play();
            audiostatus.textContent = "Pause";
        } else {
            audioplayer.pause();
            audiostatus.textContent = "Play"; 
        }
    }

    if (cmd == "controls"){
        audioplayer.toggleAttribute("controls");
    }

    if (cmd == "toggle"){
        
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







