var db, isfullscreen = false;
function toggleFullScreen(){
	db = document.body;
	if(isfullscreen == false){
		if(db.requestFullScreen){
		    db.requestFullScreen();
		} else if(db.webkitRequestFullscreen){
		    db.webkitRequestFullscreen();
		} else if(db.mozRequestFullScreen){
		    db.mozRequestFullScreen();
		} else if(db.msRequestFullscreen){
		    db.msRequestFullscreen();
		}
		isfullscreen = true;
		db.style.width = window.screen.width+"px";
		db.style.height = window.screen.height+"px";
	} else {
		if(document.cancelFullScreen){
		    document.cancelFullScreen();
		} else if(document.exitFullScreen){
		    document.exitFullScreen();
		} else if(document.mozCancelFullScreen){
		    document.mozCancelFullScreen();
		} else if(document.webkitCancelFullScreen){
		    document.webkitCancelFullScreen();
		} else if(document.msExitFullscreen){
		    document.msExitFullscreen();
		}
		isfullscreen = false;
		db.style.width = "100%";
		db.style.height = "auto";
	}
}



$(document).ready(function(){
        
    $('.fullscreen').click(function() {
        toggleFullScreen();
         if (isfullscreen == false) {
            $(this).children().attr('src', 'images/icFS1.svg');
         } else {
            $(this).children().attr('src', 'images/icFS2.svg');
         }
        
    });

});