;(function ( App, $, window, document, undefined ) {
    if ( ! isJson ) {
        var isJson = function( str ) {
            try {
                JSON.parse( str );

            } catch ( e ) {
                return false;
            }

            return true;
        };
    }

    if ( ! $.fn.serializeObject ) {
        /*!
         * jQuery serializeObject
         * @copyright 2014, macek <paulmacek@gmail.com>
         * @link https://github.com/macek/jquery-serialize-object
         * @license BSD
         * @version 2.4.3
         */
        !function(e,r){if("function"==typeof define&&define.amd)define(["exports","jquery"],function(e,i){return r(e,i)});else if("undefined"!=typeof exports){var i=require("jquery");r(exports,i)}else r(e,e.jQuery||e.Zepto||e.ender||e.$)}(this,function(e,r){function i(e,i){function n(e,r,i){return e[r]=i,e}function a(e,r){for(var i,a=e.match(t.key);void 0!==(i=a.pop());)if(t.push.test(i)){var o=s(e.replace(/\[\]$/,""));r=n([],o,r)}else t.fixed.test(i)?r=n([],i,r):t.named.test(i)&&(r=n({},i,r));return r}function s(e){return void 0===h[e]&&(h[e]=0),h[e]++}function o(e){switch(r('[name="'+e.name+'"]',i).attr("type")){case"checkbox":return"on"===e.value?!0:e.value;default:return e.value}}function u(r){if(!t.validate.test(r.name))return this;var i=a(r.name,o(r));return c=e.extend(!0,c,i),this}function f(r){if(!e.isArray(r))throw new Error("formSerializer.addPairs expects an Array");for(var i=0,t=r.length;t>i;i++)this.addPair(r[i]);return this}function d(){return c}function l(){return JSON.stringify(d())}var c={},h={};this.addPair=u,this.addPairs=f,this.serialize=d,this.serializeJSON=l}var t={validate:/^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,key:/[a-z0-9_]+|(?=\[\])/gi,push:/^$/,fixed:/^\d+$/,named:/^[a-z0-9_]+$/i};return i.patterns=t,i.serializeObject=function(){return this.length>1?new Error("jquery-serialize-object can only serialize one form at a time"):new i(r,this).addPairs(this.serializeArray()).serialize()},i.serializeJSON=function(){return this.length>1?new Error("jquery-serialize-object can only serialize one form at a time"):new i(r,this).addPairs(this.serializeArray()).serializeJSON()},"undefined"!=typeof r.fn&&(r.fn.serializeObject=i.serializeObject,r.fn.serializeJSON=i.serializeJSON),e.FormSerializer=i,i});
    }

    // Function.prototype.bind support test, and fallback for browsers without it
    if ( ! Function.prototype.bind ) {
        Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e};
    }

    // Object.create support test, and fallback for browsers without it
    if ( typeof Object.create !== "function" ) {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    /*!
     * Url validation
     * @link http://stackoverflow.com/a/8317014
     */
    var validateUrl = function( url ) {
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( url );
    };


    var Ajax = (function() {
        "use strict";

        // Private method
        var blockUI = function( base ) {
            if ( !!App && !!App.blockUI ) {
                if ( ! base.$elem.is('.unblocked:visible') ) {
                    var interval = setInterval( function() {
                        if ( base.$elem.is(':visible') ) {
                            clearInterval( interval );
                            App.blockUI( base.$elem.removeClass('unblocked') );
                        }
                    }, 400);

                    setTimeout( function() {
                        clearInterval( interval );
                    }, 5000);

                } else {
                    App.blockUI( base.$elem.removeClass('unblocked') );
                }
            }
        };

        // Private method
        var getAjaxConfig = function( base, options ) {
            var config = {
                url:  options.url,
                type: options.type || base.options.type,
                beforeSend: base.options.beforeSend.call( base.$elem ),
                complete: function( response, status, xhr ) {

                    if ( !! response.responseText) {
                        xhr = response;
                        response = response.responseText;
                    }

                    if ( isJson( response ) && !! JSON.parse( response ).redirect ) {
                        return base.callAjax( JSON.parse( response ).redirect );
                    }

                    if ( status === 'error') {
                        if ( !! options.error && typeof options.error === 'function') {
                            options.error.apply(base.$elem, [xhr, ""]);

                        } else {
                            base.options.error.apply(base.$elem, [xhr, ""]);
                        }

                        console.error("Ajax plugin: an error occurred on ajax request!");

                    } else if ( status === 'success') {
                        base.$elem.data('ajaxUrl', config.url );
                        base.$elem.data('ajaxData', config.data );

                        if ( !! options.success && typeof options.success === 'function') {
                            options.success.apply(base.$elem, [response, status, xhr]);

                        } else {
                            base.options.success.apply(base.$elem, [response, status, xhr]);
                        }
                    }

                    if ( !! App ) {
                        if ( !! App.unblockUI ) {
                            App.unblockUI( base.$elem.addClass('unblocked') );
                        }

                        if ( !! App.initUniform ) {
                            App.initUniform();
                        }
                    }

                    if ( !! options.complete && typeof options.complete === 'function') {
                        options.complete.apply( base.$elem, [xhr, status] );

                    } else {
                        base.options.complete.apply( base.$elem, [ xhr, status ] );
                    }
                }
            };

            if ( !! options.data ) {
                $.extend( config, { data: options.data } );
            }

            if ( options.hasFiles ) {
                /*!
                 * Avoiding jQuery.ajax problems with uploads
                 * https://github.com/Abban/jQueryFileUpload/blob/master/script.js#L37-L38
                 */
                $.extend( config, {
                    cache: false,
                    processData: false, // Don't process the files
                    contentType: false  // Set content type to false as jQuery will tell the server its a query string request
                });
            }

            return config;
        };

        // Private method
        var getFormData = function( hasFiles ) {
            if ( $(this).attr('method') === 'get') {
                return $(this).serialize();

            } else if ( hasFiles ) {
                return new FormData( this );

            } else {
                return $(this).serializeObject();
            }
        };

        // Private method
        var initEvents = function( base ) {
            base.$elem.on( 'click', 'a[href]', function( e ) {
                base.callAjax( $(this).attr('href'), e );
            });

            $( document ).on( 'submit', ' form', function() {
                if ( $(this).closest( base.elem ).length ) {
                    var hasFiles = $(this).find(':input[type="file"]').length;

                    base.callAjax({
                        url: $(this).attr('action') || base.$elem.data('baseAjaxUrl'),
                        data: getFormData.call( this, hasFiles ),
                        type: hasFiles ? 'post' : 'load',
                        hasFiles: hasFiles,
                        success: function( response, status, xhr ) {
                            base.$elem.html( response );
                        }
                    });

                    return false;
                }
            });
        };

        return {
            init: function( options, elem ) {
                this.options = $.extend( {}, this.options, options );

                this.elem = elem;
                this.$elem = $(elem);

                initEvents(this);

                if ( !!options ) {
                    if ( typeof options === 'string' && validateUrl(options) ) {
                        this.$elem.data( 'ajaxUrl', options );

                    } else if ( typeof options === 'object' && (!!options.url && validateUrl(options.url)) ) {
                        this.$elem.data( 'ajaxUrl', options.url );
                    }

                    this.callAjax( options );

                } else {
                    this.callAjax( this.$elem.data('ajaxUrl') );
                }

                return this;
            },

            options: {
                type: 'load',
                beforeSend: function(){},
                success: function(){},
                error: function(){},
                complete: function(){}
            },

            callAjax: function( options, Event ) {
                var base = this;

                if ( typeof options === 'string' && validateUrl(options) ) {
                    options = { url: options };
                }

                if ( $.isPlainObject( options ) && validateUrl(options.url) ) {

                    if ( !!Event ) {
                        Event.preventDefault();
                    }

                    if ( !!App.blockUI ) {
                        blockUI( base );
                    }

                    var config = getAjaxConfig( base, options );

                    if ( config.type == 'load') {
                        base.options.beforeSend.call( base.$elem );
                        base.$elem.load( config.url, config.data, config.complete );

                    } else if ( config.type.match( /^get$|^post$/i ) ) {
                        $.ajax( config );

                    } else {
                        console.error('Ajax plugin: argument options.type is invalid on callAjax!');
                    }

                    return true;

                } else {
                    return false;
                }
            },
            reload: function() {
                this.callAjax({
                    url:  this.$elem.data('ajaxUrl'),
                    data: this.$elem.data('ajaxData')
                });
            }
        };
    })();

    $.fn.Ajax = function( methodOrOptions ) {
        var methodArguments = Array.prototype.slice.call( arguments, 1 );

        return this.each(function() {
            var instance;

            if ( ! $.data( this, 'Ajax') ) {
                $.data( this, 'baseAjaxUrl', $.data(this, 'ajaxUrl') );
                instance = $.data( this, 'Ajax', Object.create( Ajax ).init( methodOrOptions, this ) );

            } else {
                instance = $.data( this, 'Ajax');
            }

            if ( instance ) {
                if ( typeof methodOrOptions === 'string' &&  Ajax[ methodOrOptions ] ) {
                    instance[ methodOrOptions ].apply( instance, methodArguments );

                } else {
                    instance.callAjax( methodOrOptions );
                }
            }
        });

    };

})( window.App, jQuery, window, document );
