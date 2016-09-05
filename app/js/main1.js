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
	];

	var View = function(container){
		var self = this;
		var sliderContainer = container.get(0);
		var slidesList = []; //массив с DOM-элементами слайдов
		var slidesCount = 0; //ожидаемое количество слайдов
		var counter = 0;

		var checkCounter = function(){
			if (counter >= slidesCount) {
				var evt = new Event('initcomplete');
				document.dispatchEvent(evt);
			};
		};

		var createImgSlide = function(url){
			var article = document.createElement('article');
					article.classList.add('slider-container__slide');
					article.classList.add('--img');
			var img = document.createElement('img');
					img.src = url;
					article.appendChild(img);
					slidesList.push(article);
					img.onload = function(){
						sliderContainer.appendChild(article);
						//счетчик чтобы определить момент добавления последнего элемента
						checkCounter(counter++);
					};
					img.oneror = function(){
						slidesCount--;
					};
		};

		var createVidSlide = function(url){
			var article = document.createElement('article');
					article.classList.add('slider-container__slide');
					article.classList.add('--vid');
			var vid = document.createElement('video');
					vid.setAttribute('controls', 'true');
					vid.src = url;
					article.appendChild(vid);
					slidesList.push(article);
					vid.load();
					vid.onloadeddata = function(){
						sliderContainer.appendChild(article);
						//счетчик чтобы определить момент добавления последнего элемента
						checkCounter(counter++);
					};
					vid.oneror = function(){
						slidesCount--;
					};
		};

		self.init = function(array){
			// создаем элементы
			slidesCount = array.length;

			for (var i = 0; i < array.length; i++) {

				var type = array[i].type;
				var url  = array[i].url;

				switch (type) {
					case 'img':
						createImgSlide(url);
						break;
					case 'vid':
						createVidSlide(url);
						break;
				};

			};

			return slidesCount;
		};

		self.welcome = function(){
			$('.preloader').addClass('hidden');
			$('.welcome').removeClass('hidden');
		};

		self.showSlider = function(){
			$('.welcome').addClass('hidden');
			container.removeClass('hidden');
		};

		self.updateSlider = function(index){
			var currSlide = $(slidesList[index]);
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

		self.startAllVideos = function(){
		var videos = document.getElementsByTagName('video');
			for (var i = 0; i < videos.length; i++){
				var thisVideo = videos[i];
				thisVideo.play();
				thisVideo.ontimeupdate = function(){
					thisVideo.ontimeupdate = null;
					setTimeout(function(){
						thisVideo.pause();
					},500);
				};
			};
		};
	};

	var Model = function(view){
		var self = this;
		var currSlide;
		var slidesList;
		var slidesCount;

		var getNextSlide = function(){
			if (currSlide < slidesCount - 1) {
				currSlide++
			} else {
				currSlide = 0;
			};
			return currSlide;
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

		self.init = function(array) {
			slidesList = array;
			slidesCount = view.init(array);
		};

		self.runSlider = function(){
			currSlide = 0;
			view.updateSlider(currSlide);
		};

	};

	var Controller = function(model, view){
		var self = this;

		var onInitComplete = function(){
			view.welcome();
		};

		var onStart = function(){
			view.showSlider();
			view.startAllVideos();
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

		// events
		document.addEventListener('slideonscreen', planNextSlide, false);
		document.addEventListener('initcomplete', onInitComplete,false);
		document.getElementsByClassName('start')[0].addEventListener('click', onStart, false);
	};

	var sliderView = new View($sliderContainer);
	var slider = new Model(sliderView);
	var controller = new Controller(slider, sliderView);
	slider.init(filesList);


}());