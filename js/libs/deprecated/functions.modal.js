function lib_modal (){

	/* =========================================== *
	** System Modal plugin
	** =========================================== */

	/* Modal elements
	============================================== */
	var prefix, modal, initModal, content, close_timeout, sys_events = 'sys-events',
		transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

	prefix = '#sys-modal';
	modal  = {
		id: '',
		elem: prefix,
		inner: prefix + '-inner',
		closer: prefix + '-closer, ' + prefix + '-cover',
		container: prefix + '-container',
		trigger: $(window),
		isClosing: false,
		isGallery: false,
		canSetPosition: false,
		content: function(return_selector){
			selector = '#' + modal.id + '-content';

			if(!!return_selector) return selector;
			else return $(selector);
		},

		target: false,
		instance: false,
		events: {
			private: ['protected', 'init', 'setContent', 'toggleShow', 'setPosition', 'close'],
			protected: {
				afterLoad: function(){
					if(!modal.canSetPosition && modal.isClosing) {
						modal.inner.height('');
						modal.inner.width('');
					}

					modal.callEvents('afterClose');
				},

				gallery: function(){
					modal.registerEvents({
						beforeShow: function(content){
							var cur_image  = 0,
								last_image = 0,
								images = content.find('img');

							if(!images.length) return;
							else last_image = images.length - 1;

							images.addClass('hide');
							images.first().removeClass('hide');

							var btn = {
								next: content.find('.next-image'),
								prev: content.find('.prev-image')
							};

							btn.next.on('click touchstart', function(event){
								event.preventDefault();

								cur_image = cur_image + 1;

								images.addClass('hide');
								if(cur_image == last_image){
									btn.next.addClass('hide');
								}

								if(cur_image > last_image){
									cur_image = last_image;
								}

								btn.prev.removeClass('hide');
								images.eq(cur_image).removeClass('hide');
								$.modal.reload();

								return false;
							});

							btn.prev.on('click touchstart', function(event){
								event.preventDefault();

								cur_image = cur_image - 1;

								images.addClass('hide');
								if(cur_image < 1){
									btn.prev.addClass('hide');
								}

								if(cur_image < 0){
									cur_image = 0;
								}

								btn.next.removeClass('hide');
								images.eq(cur_image).removeClass('hide');
								$.modal.reload();

								return false;
							});
						}
					});
				}
			},

			beforeLoad: function (){
				modal.isClosing = false;
				if(!!window.Modernizr){
					modal.elem.unbind(transitionEnd);
				} else {
					clearTimeout(close_timeout);
				}

				return modal.callEvents('beforeLoad');
			},

			beforeShow: function (){ return modal.callEvents('beforeShow'); },
			beforeClose: function (){ return modal.callEvents('beforeClose'); },

			onLoad: function(){ return modal.callEvents('onLoad'); },
			onShow: function(){ return modal.callEvents('onShow'); },
			onClose: function (){
				modal.isClosing = true;
				if(!!window.Modernizr && $('html').hasClass('csstransitions')){
					modal.elem.one(transitionEnd, function(){
						modal.events.protected.afterLoad();
					});
				} else {
					close_timeout = setTimeout(function(){
						modal.events.protected.afterLoad();
					}, 1000);
				}

				return modal.callEvents('onClose');
			},

			afterLoad: function (){ return modal.callEvents('afterLoad'); },

			init: function(id){
				if(!id){
					console.error('The current id is not valid: ', id);
					return false;
				}

				initModal(id);
				return modal.events;
			},

			close: function(events){
				modal.closer.on('click touchstart', function(){
					if($.isFunction(events)) events.call(modal.trigger);
				});

				return modal.events;
			},

			setContent: function(content){
				html_content = content.outerHTML();
				modal.container.html(html_content);
				return modal.events;
			},

			toggleShow: function(){
				$(modal.elem).removeClass('hide-minimize').addClass('show');
				return modal.events;
			},

			toggleHide: function(){
				$(modal.elem).addClass('hide-minimize').removeClass('show');	
				return modal.events;
			},

			setPosition: function(){
				if(!modal.canSetPosition) {
					var height = modal.container.height(),
						width = modal.container.width();
					
					modal.inner.height(height);
					modal.inner.width(width);

					return modal.events;
				}

				var height = modal.inner.height(),
					width = modal.inner.width();
					
				modal.inner.css({
					'margin-top':  -height / 2,
					'margin-left': -width  / 2
				});

				$(window).resize(modal.events.setPosition);

				return modal.events;
			}
		},

		registredEvents: new Object(),
		registerEvents: function(events){
			modal.cleanEvents(events);
			return $.fn.modal;
		},

		checkEvent: function(instance, event_name){
			if(event_name.toLowerCase() == 'open'){
				modal.events.init(instance.attr('id'));

			} else if(event_name.toLowerCase() == 'close'){
				modal.events.beforeClose();
				modal.events.toggleHide().onClose();

			} else if(event_name.toLowerCase() == 'reload'){
				modal.events.setPosition();
			}
		},

		callEvents: function(event_name){

			// Verificando se o alvo clicado tem eventos específicos
			event = modal.registredEvents[modal.target] || modal.registredEvents[sys_events];

			// Caso não hajam eventos retorna null
			if(!event || !event[event_name]) return;

			// Chamando eventos
			for(var i = 0, len = event[event_name].length; i < len; i++){
				if($.isFunction(event[event_name][i])){
					var selector = modal.content(true),
						content  = modal.container.find(selector);

					event[event_name][i].call(modal.trigger, content);
				}
			}
		},

		cleanEvents: function(base_events){
			if(!base_events) return;
			for(var e in base_events){
				if(!base_events[e]) continue;
				breake = false;

				// Caso não tenha um id definido,
				// os eventos de callback, são
				// enviados para o sys_events
				if(!$.isPlainObject(base_events[e])){
					breake = true;
					events = base_events;
					e = sys_events;
				} else var events = base_events[e];

				for(var i in events){

					// Verificando objeto
					if (!events.hasOwnProperty(i)) continue;

					// Removendo eventos privados
					for(var x = 0, len = modal.events.private.length; x < len; x++){
						if(i === modal.events.private[x]) delete events[i];
					}

					// Caso não haja id para
					// o conjunto de eventos, 
					// utiliza o sys_events
					if(!e) e = sys_events;

					// Criando item no objeto de eventos
					if(!modal.registredEvents[e])
						modal.registredEvents[e] = new Object();

					// Criando array de eventos
					if(!modal.registredEvents[e][i])
						modal.registredEvents[e][i] = new Array();

					// Registrando novos eventos no modal
					if(e != sys_events)
						 modal.registredEvents[e][i].push(events[i]);
					else modal.registredEvents[e][i] = [events[i]];
				}

				// Caso seja para parar o loop
				if(!!breake) break;
			}

			return modal.registredEvents;
		}
	};

	/* Modal init
	============================================== */
	initModal = function (id){
		modal.id = id;
		content = modal.content();
		if(!content[0]) return;

		if(!modal.instance){
			modal.elem = $(modal.elem);
			modal.inner = $(modal.inner);
			modal.closer = $(modal.closer);
			modal.container = $(modal.container);

			modal.elem.appendTo(document.body);
			modal.instance = true;
		}

		if(!!modal.canSetPosition){
			modal.elem.addClass('positionJS');
		} else {
			modal.elem.addClass('positionCSS');
		}

		// Guardando elemento alvo do click
		modal.target = '#'+id;

		modal.events.beforeLoad();

		// Inserindo conteudo
		modal.events.setContent(content);
		modal.events.onLoad();

		modal.events.beforeShow();

		// Ajustando posições
		modal.events.setPosition().toggleShow();

		// Mostrando modal
		modal.events.onShow();

		// Fechando modal
		modal.events.close(function(){
			modal.events.beforeClose();
			modal.events.toggleHide().onClose();
		});
	};

	/* Modal on click
	============================================== */
	$.fn.modal = function(events){
		if(typeof events == 'string'){
			return this.each(function(){
				modal.checkEvent($(this), events);	
			});
		}

		modal.trigger = this;
		modal.registredEvents = new Object;

		if(!!events){
			if(!!events.positionJS){
				modal.canSetPosition = true;
				delete events.positionJs;
			}

			if(!!events.isGallery){
				modal.isGallery = true;
				modal.events.protected.gallery();

				delete events.isGallery;
			}

			init_events = new Object;
			init_events[sys_events] = events;
			modal.cleanEvents(init_events);

		} else {
			modal.isGallery = false;
			modal.canSetPosition = false;
		}

		return this.on('click touchstart', function(event){
			if(this.tagName.toLowerCase() == 'a'){
				event.preventDefault();
			}

			modal.events.init(this.id);
		});
	};

	/* Modal extended
	============================================= */
	$.modal = {
		open: function(events){
			if(!!events.trigger){
				modal.trigger = events.trigger;
				modal.trigger.id = modal.trigger.attr('id');

			} else if(!!events.id){
				modal.trigger = $('#' + events.id);
				modal.trigger.id = events.id;

			} else {
				return false;
			}

			init_events = new Object;
			init_events[sys_events] = events;
			modal.cleanEvents(init_events);
			modal.events.init(modal.trigger.id);

			return $.modal;
		},

		close: function(){
			modal.events.beforeClose();
			modal.events.toggleHide().onClose();

			return $.modal;
		},

		reload: function(){
			modal.events.setPosition();

			return $.modal;
		}
	};


	/* Modal register outer events
	============================================= */
	$.fn.modal.registerEvents = function(events){
		modal.registerEvents(events);
		return this;
	};

	$.fn.modal.update = function(){
		modal.events.setPosition();
		return modal.trigger;
	};


	/* Helpers Plugins
	============================================= */
	if(!$.fn.outerHTML){
		$.fn.outerHTML = function() {
			if(!this[0]) return this;

			var container = document.createElement('div');
				container.appendChild(this[0].cloneNode(true));

			return container.innerHTML;
		};
	}
}

library = null;
if(typeof jsHelper != 'undefined')
	 library = jsHelper;
else if(typeof Zepto != 'undefined')
	 library = Zepto;
else if(typeof jQuery != 'undefined')
	 library = jQuery;
else console.error('Não foram encontradas bibliotecas de javacript para utilizar as funções da modal, bibliotecas suportadas: jsHelper, Zepto ou jQuery');

if(!!library){
	(function($){
		lib_modal();
	})(library);
}
