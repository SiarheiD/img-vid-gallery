var $main = $(".main");
var $current = 0;
var dir = 'images/slider/';
var files;
var numbersFile;
var id; 

function checkIMG($n) {
    var elem = files[$n];
    var suffix = elem.split('.');
    if (suffix[suffix.length - 1] === 'jpg') 
        return true;
    else return false;
}

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
    
    $.ajax( {
        type : 'GET',
        url : 'php/function.php',
        async : false, 
        success: function(data){
            files = JSON.parse(data);
            files.splice(0,2);
            numbersFile = files.length;
        }
    });
    
    if (checkIMG($current)) {
        $main.append('<img src=' +dir +  files[$current] + ' alt=""/>');
    } else {
        $main.append('<video controls><source src=' + dir + files[$current] + 'type="video/mp4"/></video>');
        var vid = $main.children()[1];
        
        vid.onended = function() {
            Next();
        }
        vid.play();
    }
    
    id=setInterval('Next()', 5000);

});

function Change_img($n){
    $main.children()[1].remove();
    if (checkIMG($n)) {
        $main.append('<img src=' + dir + files[$n] + ' alt=""/>');
    } else {
        $main.append('<video controls><source src=' + dir + files[$n] + ' type="video/mp4"/></video>');
        var vid = $main.children()[1];
        clearInterval(id);
        vid.onended = function() {
            id=setInterval('Next()', 5000);
            Next();  
        }
        vid.play();
         
    }
}

function Next(){
    $current++;
    if ($current>=numbersFile) 
        $current=0;
    Change_img($current);
}