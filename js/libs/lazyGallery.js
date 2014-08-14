;(function($, window, document, undefined) {
	"use strict";

	/**
	 * Forces the element to use jQuery
	 *
	 * @method jQueryElement
	 * @param {mixed} element
	 * @return element
	 */
	var jQueryElement = function(element) {
		if (!(element instanceof jQuery)) {
			element = $(element);
		}

		return element;
	};

	/**
	 * Load elements in list after DOM is ready
	 *
	 * @method LazyGallery
	 * @param {jQuery Object} $element
	 * @param {Object} options
	 * @return CallExpression
	 */
	var LazyGallery = function($element, options) {

		var Self = this,
			$container = $('<ul>'),
			settings = $.extend(true, {
				content: '',
				scope: {},
				loadMax: 5
			}, options || {});


		var Private = {
			groups: {
				ready: null,
				waiting: null
			},

			events: {
				/**
				 * Before load any item on gallery this event is called
				 *
				 * @method beforeLoad
				 * @param {jQuery Object} container
				 */
				beforeLoad: function(container) {},

				/**
				 * When load each item to gallery this event is called
				 *
				 * @method onLoad
				 * @param {jQuery Object} container
				 * @param {jQuery Object} element
				 * @param {integer} index
				 * @param {Object} scope
				 */
				onLoad: function(container, element, index, scope) {},

				/**
				 * When all items are loaded this event is called
				 *
				 * @method afterLoad
				 * @param {jQuery Object} container
				 */
				afterLoad: function(container) {},

				/**
				 * When adding each item to DOM this event is called
				 *
				 * @method onAdd
				 * @param {jQuery Object} container
				 * @param {jQuery Object} newElements
				 */
				onAdd: function(container, newElements) {},

				/**
				 * When removing each item from DOM this event is called
				 *
				 * @method onRemove
				 * @param {jQuery Object} container
				 * @param {jQuery Object} oldElements
				 */
				onRemove: function(container, oldElements) {},

				/**
				 * When the gallery waiting list is full this event is called
				 *
				 * @method onFull
				 * @param {jQuery Object} container
				 * @param {Object} options
				 */
				onFull: function(container, options) {},

				/**
				 * When the gallery ready list is empty this event is called
				 *
				 * @method onEmpty
				 * @param {jQuery Object} container
				 * @param {Object} options
				 */
				onEmpty: function(container, options) {},

			},

			/**
			 * The constructor method
			 *
			 * @method init
			 * @return {Object} LazyGallery Instance
			 */
			init: function() {
				if (!settings.content || !settings.scope) {
					$.error("lazyGallery issue: options content OR options.scope isn't defined!");
					return false;

				} else if (!$element.find(settings.content).get(0) ||
				           !$element.find(settings.content).get(0).innerHTML
				) {
					$.error("lazyGallery issue: content element isn't found OR is empty!");
					return false;

				} else {
					settings.content = $element.find(settings.content).get(0).innerHTML;
					$container.appendTo($element);
				}

				for (var key in settings) {
					if (Private.events.hasOwnProperty(key)) {
						Private.events[key] = settings[key];
					}
				}

				// Before Load Event
				Private.events.beforeLoad.call($element, $container);

				var count = settings.scope.length,
					counter = 0,
					htmlContent,
					$content;

				for (var i = 0; i < count; i++) {
					htmlContent = Private.load(settings.scope[i]);

					if (!htmlContent) {
						continue;

					} else {
						$content = $(htmlContent).data({
							'index': i,
							'scope': settings.scope[i]
						});

						// On Load Event
						Private.events.onLoad.apply($element,
						[$container, $content, i, settings.scope[i]]);
					}

					counter++;
					if (counter <= settings.loadMax) {
						Public.add({elements: $content});

					} else {
						if (!Private.groups.waiting) {
							Private.groups.waiting = $content;

						} else {
							Private.groups.waiting = Private.groups.waiting.add($content);
						}
					}
				}

				$.extend(true, Self, {'public': Public});

				// Before Load Event
				Private.events.afterLoad.call($element, $container);


				if (count <= settings.loadMax || !Private.groups.waiting) {
					// On Full Event
					Private.events.onFull.call($element, $container, '');

				} else if (!Private.groups.ready) {
					// On Empty Event
					Private.events.onEmpty.call($element, $container, '');
				}

				return Self;
			},

			/**
			 * Render the html from the template script with Mustache syntax
			 *
			 * @method load
			 * @param {Object} scopeItem
			 * @return {mixed} boolean OR HTML string
			 */
			load: function(scopeItem) {
				var content = $('<li>').append(settings.content);

				if (!!content[0].outerHTML) {
					return Mustache.render(content[0].outerHTML, scopeItem);

				} else {
					return false;
				}
			},

			/**
			 * Fills and checks the methods Public.add and Public.remove options
			 *
			 * @method checkMethodOptions
			 * @param {Object} customOptions
			 * @param {jQuery Object} $elementsFallback
			 * @return {Object} options
			 */
			checkMethodOptions: function(customOptions, $elementsFallback) {
				var options = $.extend(true, {
						loadMax: settings.loadMax || 1,
						elements: null,
						filter: ''
					}, customOptions || {});


				if (!options.elements && !!$elementsFallback) {
					options.elements = $elementsFallback;
				}

				options.elements = jQueryElement(options.elements);

				if (!!options.filter) {
					options.elements = options.elements.filter(options.filter);
				}

				if (!options.elements.length || parseInt(options.loadMax) <= 0) {
					options.elements.length = false;
				}

				return options;
			}
		};

		var Public = {
			/**
			 * Checks if the current waiting list is empty, it means
			 * that the ready list is full
			 *
			 * @method checkFull
			 * @param {Object} options
			 * @return {boolean}
			 */
			checkFull: function(options) {
				options = $.extend(true, {
					filter: '',
					loadMax: settings.loadMax || 1
				}, options || {});

				if (!Private.groups.waiting ||
					!Private.groups.waiting.filter(options.filter).length
				) {

					// On Full Event
					Private.events.onFull.call($element, $container, options);
					return true;

				} else {
					return false;
				}
			},

			/**
			 * Checks if the current ready list is empty, it means
			 * that the waiting list is full
			 *
			 * @method checkEmpty
			 * @param {Object} options
			 * @return {Boolean}
			 */
			checkEmpty: function(options) {
				options = $.extend(true, {
					filter: '',
					loadMax: settings.loadMax || 1
				}, options || {});


				if (!Private.groups.ready ||
					!Private.groups.ready.filter(options.filter).length
				) {

					// On Empty Event
					Private.events.onEmpty.call($element, $container, options);
					return true;

				} else {
					return false;
				}
			},

			/**
			 * Inserts new gallery items to DOM
			 *
			 * @method add
			 * @param {Object} options
			 */
			add: function(options) {
				var $newElements;
				
				options = Private.checkMethodOptions(options, Private.groups.waiting);

				if (!!options.elements.length) {
					$newElements = options.elements;

				} else {
					return Public.checkFull(options);
				}

				$newElements = $newElements.slice(0, parseInt(options.loadMax));

				if ($newElements.length) {
					$newElements.appendTo($container);
				}

				// On Add Event
				Private.events.onAdd.call($element, $container, $newElements);


				if (!Private.groups.ready || !Private.groups.ready.length) {
					Private.groups.ready = $newElements;

				} else {
					Private.groups.ready = Private.groups.ready.add($newElements);
				}

				if (!!Private.groups.waiting) {
					Private.groups.waiting = Private.groups.waiting.not($newElements);

					Public.checkFull(options);
				}
			},

			/**
			 * Removes the last  gallery items or a custom elements list from DOM 
			 *
			 * @method remove
			 * @param {Object} options
			 */
			remove: function(options) {
				var $oldElements;
				
				options = Private.checkMethodOptions(options, Private.groups.ready.toArray().reverse());

				if (!!options.elements.length) {
					$oldElements = options.elements;

				} else {
					return Public.checkEmpty(options);
				}

				$oldElements = $oldElements.slice(0, options.loadMax);

				// On Remove Event
				Private.events.onRemove.call($element, $container, $oldElements);


				if ($oldElements.length) {
					$oldElements.detach();
				}

				if (!Private.groups.waiting || !Private.groups.waiting.length) {
					Private.groups.waiting = $oldElements;

				} else {
					Private.groups.waiting = Private.groups.waiting.add($oldElements);
				}

				if (!!Private.groups.ready) {
					Private.groups.ready = Private.groups.ready.not($oldElements);

					Public.checkEmpty(options);
				}
			}
		};


		return Private.init();
	};


	/**
	 * jQuery shortcut to LazyGallery library
	 *
	 * @method lazyGallery
	 * @param {Object OR String} options
	 * @return CallExpression
	 */
	$.fn.lazyGallery = function(options) {
		var instance,
			methodArgs = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			instance = $.data(this, 'lazyGallery');

			if (typeof options === 'string' && !!instance && !!instance.public[options]) {

				/**
				 * Call a method from current instance
				 * e.g. $('selector').lazyGallery('methodName');
				 */

				return instance.public[options].apply(instance, methodArgs);

			} else if (typeof options === 'object' || !options) {

				/**
				 * Create the lazyGallery on selected element
				 * e.g.
				 *
				 * $('selector').lazyGallery({
				 *     content: "selector" || jQuery Element,
				 *     scope: Array of items to insert in current DOM Element
				 * });
				 */

				if (!$.data(this, 'lazyGallery')) {
					$.data(this, 'lazyGallery',
					new LazyGallery($(this), options));
				}

			} else {
				$.error( "lazyGallery issue: Method \"" +  options + "\" does not exist!" );
			}
		});
	};


	/**
	 * Easing access to isotope and lazyGallery
	 *
	 * @method isotopeGallery
	 * @param {Object OR String} options
	 * @return CallExpression
	 */
	$.fn.isotopeGallery = function(options) {
		var instance,
			isGalleryMethod = false,
			methodArgs = Array.prototype.slice.call(arguments, 1);

		if (!options.hasOwnProperty('galleryAdd')) {
			$.error( "isotopeGallery issue: Option \"galleryAdd\" is not isset!" );
			return false;
		}

		if (!options.hasOwnProperty('navigation')) {
			$.error( "isotopeGallery issue: Option \"navigation\" is not isset!" );
			return false;
		}

		if (!options.hasOwnProperty('lazyGallery')) {
			$.error( "isotopeGallery issue: Option \"lazyGallery\" is not isset!" );
			return false;
		}

		if (!options.lazyGallery.hasOwnProperty('loadMax')) {
			$.error( "isotopeGallery issue: Option \"lazyGallery.loadMax\" is not isset!" );
			return false;
		}


		var settings = {
				isotope: {},
				lazyGallery: {}
			},
			custom = {
				ready: {},
				fancybox: [],
				allFilter: 0
			};

		settings.isotope = $.extend(true, {
			layoutMode: 'masonry',
			masonry: { isFitWidth: true },
			getSortData: {
				index: function(galleryItem) {
					return $(galleryItem).data('index');
				}
			}
		}, options || {});


		settings.lazyGallery = $.extend(true, {}, options.lazyGallery);

		if (!!settings.lazyGallery.scope.length) {
			settings.lazyGallery.loadMax = settings.lazyGallery.scope.length;
		}


		var filterList = function (container, currentFilter, $galleryAdd) {
			var $elements,
				waitingFilter = currentFilter === '*' ? '.all-filter' : currentFilter + ':not(.waiting)';

			// Filter on isotope
			container.isotope({
				filter: function() {

					return $(this).is(waitingFilter) || $(this).is($galleryAdd);
				}
			}).isotope('layout');


			// Filter on fancybox
			custom.fancybox = [];
			$elements = container.find(waitingFilter).each(function(){
				custom.fancybox.push($(this).data('fancybox-options'));
			});

			$elements.on('click touchstart', function(){
				$.fancybox(custom.fancybox, {index: $elements.index(this)});
			});

			return container;
		};

		var checkFull = function(container, currentFilter, $galleryAdd, $navElement) {
			var waitingFilter = (currentFilter === '*' ? ':not(.all-filter)' : currentFilter + '.waiting') + '.gallery-item';

			if (!container.children(waitingFilter).length) {
				$navElement.addClass('full');

				if ($navElement.hasClass('active')){
					$galleryAdd.hide();
				}

			} else {
				$galleryAdd.not(':visible').show();
			}
		}

		settings.lazyCallbacks = {
			/**
			 * Before load the gallery items, the isotope is called and when 
			 * the navigation is active, check if the current list is full
			 *
			 * @method afterLoad
			 * @param {jQuery Object} container
			 * @return 
			 */
			afterLoad: function(container) {
				var $galleryAdd,
					$lazyElement = $(this),
					$navigation  = jQueryElement(options.navigation),
					navigationFilters = '';

				// Isotope
				container.isotope(settings.isotope);

				if (!!options.lazyGallery.afterLoad &&
					$.isFunction(options.lazyGallery.afterLoad)
				) {
					options.lazyGallery.afterLoad.call(this, container);
				}

				// Gallery Add Button
				var $galleryAdd = jQueryElement(options.galleryAdd);


				// Filter All
				filterList(container, '*', $galleryAdd);


				// Navigation on list
				$navigation.on('click touchstart', function() {
					if ($(this).hasClass('.active')) return;

					var currentFilter = $(this).data('filter');

					$navigation.removeClass('active');
					$(this).addClass('active');


					if ($(this).hasClass('full')) {
						$galleryAdd.hide();

					} else {
						$galleryAdd.show().data('filter', currentFilter);
					}

					// Filter current group
					filterList(container, currentFilter, $galleryAdd);
				});


				// Add button
				$galleryAdd.on('click touchstart', function() {
					var $galleryItems,
						waitingFilter,
						currentFilter = $(this).data('filter'),
						sliceFilter   = (currentFilter === '*' ? ':not(.all-filter)' : '.waiting' + currentFilter)  + '.gallery-item';


					$galleryItems = container.children(sliceFilter)
						.slice(0, options.lazyGallery.loadMax + 1)
						.removeClass('waiting').addClass('all-filter');


					if(currentFilter == '*'){
						$navigation.each(function(){
							checkFull(container, $(this).data('filter'), $galleryAdd, $(this));
						});

					} else {
						checkFull(container, currentFilter, $galleryAdd, $navigation.filter('[data-filter="' + currentFilter + '"]'));
					}


					// Filter current add elements to group
					filterList(container, currentFilter, $galleryAdd);
				});
			},

			/**
			 * When load each item to gallery, adds a class
			 * name to filtering on isotope
			 *
			 * @method onLoad
			 * @param {jQuery Object} container
			 * @param {jQuery Object} element
			 * @param {integer} index
			 * @param {Object} scope
			 */
			onLoad: function(container, element, index, scope) {
				var categoryId = scope.id,
					className  = 'gallery-item category-' + categoryId,
					fancyOptions = !scope.video ? {
						'title': scope.fields.titulo,
						'type': 'image',
						'href': scope.normal
					} : {
						'padding':       0,
						'autoScale':     false,
						'transitionIn':  'none',
						'transitionOut': 'none',
						'title':  this.title,
						'width':  680,
						'height': 495,
						'href': scope.video.url.replace(new RegExp("watch\\?v=", "i"), 'v/'),
						'type': 'swf',
						'swf': {
							'wmode': 'transparent',
							'allowfullscreen': 'true'
						}
					};

				if (!custom.ready[categoryId]) {
					custom.ready[categoryId] = 0;
				}

				if (custom.ready[categoryId] >= options.lazyGallery.loadMax) {
					className+= ' waiting';
				}

				if (custom.allFilter < options.lazyGallery.loadMax) {
					className+= ' all-filter';
				}

				custom.allFilter++;
				custom.ready[categoryId]++;

				element.addClass(className).data('fancybox-options', fancyOptions);

				if (!!options.lazyGallery.onLoad &&
					$.isFunction(options.lazyGallery.onLoad)
				) {
					options.lazyGallery.onLoad.call(this, container, element, index, scope);
				}
			}
		};


		$.extend(true, settings.lazyGallery, settings.lazyCallbacks);


		if (settings.isotope.hasOwnProperty('lazyGallery')) {
			delete settings.isotope.lazyGallery;
		}

		if (settings.isotope.hasOwnProperty('galleryAdd')) {
			delete settings.isotope.galleryAdd;
		}

		if (settings.isotope.hasOwnProperty('galleryRemove')) {
			delete settings.isotope.galleryRemove;
		}

		if (settings.isotope.hasOwnProperty('navigation')) {
			delete settings.isotope.navigation;
		}


		return this.lazyGallery(settings.lazyGallery);
	}
})(jQuery, window, document);
