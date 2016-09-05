(function(){

	var TIMER = 2000;
	var $sliderContainer = $('.slider-container');

	var filesList = [
		{
			type : 'img',
			url  : 'img/1.jpg'
		},
		{
			type : 'vid',
			url  : 'vid/3.mp4'
		},
		{
			type : 'img',
			url  : 'img/2.jpg'
		},
		{
			type : 'vid',
			url  : 'vid/3.mp4'
		},
		{
			type : 'img',
			url  : 'img/2.jpg'
		},
	];

/*===================== view ====================================*/
	var View = function(container){
		var self = this;
		var sliderContainer = container.get(0);

		self.init = function(slidesArray){
			var i = 0;
			createNextElement();
			function createNextElement(){
				var slide = slidesArray[i];
				var article;
				var innerElement;

				article = document.createElement('article');
				article.classList.add('slider-container__slide');
				article.classList.add('--' + slide.type);
				if (slide.type == 'img') {
					innerElement = document.createElement('img');
					article.appendChild(innerElement);
					innerElement.src = slide.url;
					innerElement.onload = function(){
						i++;
						sliderContainer.appendChild(article);
						if (i < slidesArray.length){
							createNextElement();
						} else {
							var event = new Event('initcomplete');
							document.dispatchEvent(event);
						};
					};
				} else if (slide.type =='vid'){
					innerElement = document.createElement('video');
					article.appendChild(innerElement);
					innerElement.src = slide.url;
					innerElement.setAttribute('controls', 'controls')
					innerElement.load();
					innerElement.onloadeddata = function(){
						i++;
						sliderContainer.appendChild(article);
						if (i < slidesArray.length){
							createNextElement();
						} else {
							var event = new Event('initcomplete');
							document.dispatchEvent(event);
							console.log(i-1 + ' / ' + slidesArray.length);
						};
					};
				};
			};
		};

		var i = 0;

		self.startNextVideo = function(){
			var videos = document.getElementsByTagName('video');
			var video = videos[i];
			video.play();
			video.ontimeupdate = function(){
				var self = this;
				self.ontimeupdate = null;
				setTimeout(function(){self.pause();
				i++;
				if (i == videos.length) {
					var event = new Event('allvideosstarted');
				} else {
					event = new Event('videostarted');
				};
				document.dispatchEvent(event);

				}, 3000);


			};

		};
		// self.startAllVideos = function(){
		// 	var videos = document.getElementsByTagName('video');
		// 	var preloader = document.getElementsByClassName('preloader')[0];
		// 	var i = 0;
		// 	var startedCount = 0;
		// 	for (var i = 0; i < videos.length; i++){
		// 		var video = videos[i];
		// 		video.play();
		// 		video.ontimeupdate = function(){
		// 			var self = this;
		// 			this.ontimeupdate = null;
		// 			setTimeout(function(){
		// 				self.pause();
		// 				startedCount++;
		// 				preloader.textContent = 'loading' + startedCount + ' / ' + videos.length;
		// 				if (startedCount == videos.length) {
		// 					var event = new Event('allvideosstarted');
		// 					document.dispatchEvent(event);
		// 				};
		// 			},10000);

		// 		};
		// 	};
		// 	// var startNextVideo = function(){

		// 	// 	preloader.textContent = 'loading' + i + ' / ' + videos.length;
		// 	// 	var video = videos[i];
		// 	// 	video.play();
		// 	// 	video.ontimeupdate = function(){
		// 	// 		video.ontimeupdate = null;
		// 	// 		video.pause();
		// 	// 		i++;
		// 	// 		if (i < videos.length) {
		// 	// 			startNextVideo();
		// 	// 		} else {
		// 	// 			var event = new Event('allvideosstarted');
		// 	// 			document.dispatchEvent(event);
		// 	// 		};
		// 	// 	};
		// 	// };

		// 	// startNextVideo();
		// };

		self.welcome = function(){
			$('.welcome').removeClass('hidden').siblings().addClass('hidden');
		};

		self.preloader = function(){
			$('.preloader').removeClass('hidden').siblings().addClass('hidden');
		};

		self.showSlider = function(){
			$('.preloader').addClass('hidden');
			container.removeClass('hidden');
		};

		self.updateSlider = function(index){
			var currSlide = $('.slider-container__slide').eq(index);
			var event = new Event('slideonscreen');
			event.obj = currSlide;
			currSlide.addClass('active').siblings().removeClass('active');
			if (currSlide.hasClass('--vid')) {
				var currVid = currSlide.children('video').get(0)
				currVid.play();
				currVid.onended = function(){
					document.dispatchEvent(event);
					currVid.pause();
					currVid.currentTime = 0;
				};
			} else {
				document.dispatchEvent(event);
			};
		};
	};
/*----------------------------------------------------------*/

/*==================== MODEL ===============================*/

	var Model = function(view){
		var self = this;
		var currSlide;
		var slidesCount;

		self.init = function(array) {
			currSlide = 0;
			slidesCount = array.length;
			view.init(array);
		};

		self.runSlider = function(){
			view.updateSlider(currSlide);
		};

		self.slide = function(timer){
			var timer = timer || 0;
			var startTime = (new Date()).getTime();
			var interval = setInterval(function(){
				var justNow = (new Date()).getTime();
				if (justNow - startTime >= timer) {
					clearInterval(interval);
					view.updateSlider(getNextSlide());
				};
			},0);
		};

		var getNextSlide = function(){
			if (currSlide < slidesCount - 1) {
				currSlide++;
			} else {
				currSlide = 0;
			};
			return currSlide;
		};

	};
/*----------------------------------------------------------*/
/*===================== COntroller ================================*/
	var Controller = function(model, view) {
		var self = this;

		var onInitComplete = function(){
			view.welcome();
		};

		var onStart = function(){
			view.preloader();
			view.startNextVideo();
		};

		var runSlider = function(){
			view.showSlider();
			model.runSlider();
		};

		var planNextSlide = function(evt){
			console.log('plan')
			var evt = evt || window.event;
			if (evt.obj.hasClass('--img')) {
				model.slide(TIMER);
			} else {
				model.slide();
			};
		};

		var onVideoStarted = function(){
			view.welcome();
		};
		document.addEventListener('slideonscreen', planNextSlide, false);
		document.addEventListener('videostarted', onVideoStarted, false);
		document.addEventListener('initcomplete', onInitComplete, false);
		document.addEventListener('allvideosstarted', runSlider, false);
		document.getElementsByClassName('start')[0].addEventListener('click', onStart, false);
	};
/*-------------------------------------------------------------*/

	var sliderView = new View($sliderContainer);
	var sliderModel = new Model(sliderView);
	var controller = new Controller(sliderModel, sliderView);
	sliderModel.init(filesList);


}())