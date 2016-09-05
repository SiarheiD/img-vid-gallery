(function(){

	var $sliderContainer = $('.slider-container');

	var filesList = [
		{
			type : 'img',
			url  : 'img/1.jpg'
		},
		{
			type : 'vid',
			url  : 'vid/3.mp4'
		}
	];

	var createImgSlide = function(url){
		var article = document.createElement('article');
				article.classList.add('slider-container__slide');
				article.classList.add('--img');
				article.classList.add('hidden');
		var img = document.createElement('img');
				img.src = url;
				img.onload = function(){
					article.appendChild(img);
					$sliderContainer.get(0).appendChild(article);
				};
	};

	var createVidSlide = function(url){
		var article = document.createElement('article');
				article.classList.add('slider-container__slide');
				article.classList.add('--vid');
				article.classList.add('hidden');
		var vid = document.createElement('video');
				vid.setAttribute('controls', 'true');
				vid.src = url;
				vid.load();
				vid.onloadeddata = function(){
					article.appendChild(vid);
					$sliderContainer.get(0).appendChild(article);
				};
	};

	for (var i = 0; i < filesList.length; i++) {

		var type = filesList[i].type;
		var url  = filesList[i].url;

		switch (type) {
			case 'img':
				createImgSlide(url);
				break;
			case 'vid':
				createVidSlide(url);
				console.log('vid');
				break;
			default:
				console.log('hz');
		};

	};

	startAllVideos = function(){
		var videos = document.getElementsByTagName('video');
		for (var i = 0; i < videos.length; i++){
			var thisVideo = videos[i];
			thisVideo.play();
			thisVideo.ontimeupdate = function(){
				thisVideo.ontimeupdate = null;
				document.body.style.backgroundColor = 'red';
				setTimeout(function(){
					thisVideo.pause();
					thisVideo.play();
				},500)

			};
		};
		// button.removeEventListener('click', startAllVideos, false);
		// button.removeEventListener('touchstart', startAllVideos, false);

	};

	var button = document.getElementsByTagName('button')[0];
	button.addEventListener('touchstart', startAllVideos, false);
	button.addEventListener('click', startAllVideos, false);

}());