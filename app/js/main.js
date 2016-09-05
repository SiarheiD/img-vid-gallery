/*
	0) получить JSON
	1) собрать картинки и впихнуть их в контейне слайдера
	2) собрать слайдер добавить кнопки переключения слайдера
	3) автоплэй слайдера
	4) 
*/

(function(){

	var TIMER = 3000;

	var filesList = [
		{
			type : 'img',
			url  : 'img/slides/1.jpg'
		},
		{
			type : 'img',
			url  : 'img/slides/2.jpg'
		},
		{
			type : 'img',
			url  : 'img/slides/1.jpg'
		},
		{
			type : 'img',
			url  : 'img/slides/2.jpg'
		},
		{
			type : 'img',
			url  : 'img/slides/1.jpg'
		},
		{
			type : 'img',
			url  : 'img/slides/2.jpg'
		},
	];

	var $sliderContainer = $('.slider');

/*============== VIEW ========================*/
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
				article.classList.add('slider__item');

				innerElement = document.createElement('img');
				article.appendChild(innerElement);
				innerElement.src = slide.url;

				innerElement.onload = function(){
					sliderContainer.appendChild(article);
					i++;
					if (i < slidesArray.length){
						createNextElement();
					} else {console.log('compl')
						var event = new Event('initcomplete');
						document.dispatchEvent(event);
					};
				};
				innerElement.error = function(){
					i++;
					if (i < slidesArray.length){
						createNextElement();
					} else {console.log('compl')
						var event = new Event('initcomplete');
						document.dispatchEvent(event);
					};
				};
			};
		};

		self.createSliderNav = function(){
			var addToggler = function(slider) {
				var slidesCount = slider.querySelectorAll('article').length;
				if (slidesCount > 1) {
					var toggler = document.createElement('div');
					toggler.classList.add('slider__dots');
					var dotsWrapper = document.createElement('div');
					dotsWrapper.classList.add('dots-wrapper')
					for (var i = 0; i < slidesCount; i++) {
						var dot = document.createElement('span');
						dot.dotIndex = i;
						dotsWrapper.appendChild(dot);
					};
					toggler.appendChild(dotsWrapper);
					slider.appendChild(toggler);
				};
			};
			var activateFirstSlide = function(slider) {
				var firstSlide = slider.querySelector('article');
				var firstButton = slider.querySelector('.slider__dots span');
				if (firstSlide) firstSlide.classList.add('active');
				if (firstButton) firstButton.classList.add('active');
			};
			addToggler(sliderContainer);
			activateFirstSlide(sliderContainer);
		};
		self.updateSlider = function(index){
			var currSlide = $('.slider__item').eq(index);
			var currDot = $('.slider__dots span').eq(index);
			var event = new Event('slideonscreen');
			event.currSlideIndex = index;
			currSlide.addClass('active').siblings().removeClass('active');
			currDot.addClass('active').siblings().removeClass('active');
			document.dispatchEvent(event);
		};
	};
/*--------------------------------------*/

/*============== MODEL ======================*/
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

		self.slide = function(timer, newIndex){
			var timer = timer || 0;
			var startTime = (new Date()).getTime();
			if (newIndex !== undefined && newIndex >= 0 && newIndex < slidesCount) {
				currSlide = newIndex;
			};
			self.interval = setInterval(function(){
				var justNow = (new Date()).getTime();
				if (justNow - startTime >= timer) {
					clearInterval(self.interval);
					view.updateSlider(getNextSlide());
				};
			},0);
		};
		self.disapleAutoplay = function(){
			clearInterval(self.interval);
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
/*--------------------------------------*/

/*================ CONTROLLER ====================*/
	var Controller = function(model, view){

		var documentOnClick= function(evt){
			evt = evt || window.event;
			if (evt.which != 1) {
				return false;
			};
			var target = evt.target || evt.srcElement;

			if (target.closest('.slider__dots span')) {
				evt.preventDefault();
				model.disapleAutoplay();
				view.updateSlider(target.closest('.slider__dots span').dotIndex);
			};
		};

		var onInitComplete = function(){
			view.createSliderNav();
			model.runSlider();
		};

		var planNextSlide = function(evt){

			var evt = evt || window.event;
			model.slide(TIMER, evt.currSlideIndex);

		};

		document.addEventListener('click', documentOnClick, false);
		document.addEventListener('initcomplete', onInitComplete, false);
		document.addEventListener('slideonscreen', planNextSlide, false);

	};
/*--------------------------------------*/

	var sliderView = new View($sliderContainer);
	var sliderModel = new Model(sliderView);
	var controller = new Controller(sliderModel, sliderView);

	sliderModel.init(filesList);

}());