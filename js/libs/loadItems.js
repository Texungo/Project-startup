;(function( $, window, document, undefined ) {
    'strict mode';

    var parseParams = function( config, obj ) {
        var params = {
            count: 0,
            template: '',
            data: []
        };

        if ( !! config && $.isPlainObject( config ) ) {
            params = $.extend( params, config || {} );

        } else if ( !! config && $.isNumeric( config ) ) {
            params.count = config;
        }

        if ( obj !== undefined ) {
            if ( ! params.template && !! obj.$elem.data('loadItemsTemplate') ) {
                    params.template = obj.$elem.data('loadItemsTemplate');

            } else {
                return console.error('Failed to initialize plugin: missing template config!');
            }
        }

        if ( !! params.template && ! (params.template instanceof( jQuery )) ) {
            params.template = $( params.template );
        }

        return params;
    };

    var getExtendType = function( obj ) {
        return $.isPlainObject( obj ) ? {} : $.isArray( obj ) ? [] : null;
    };

    var LoadItems = {
        init: function( config, elem ) {
            this.elem   = elem;
            this.$elem  = $( elem );
            this.params = parseParams( config, this );
            this.$template = this.params.template;

            this.data = {
                original: $.extend( getExtendType( this.params.data ), this.params.data ),
                toLoad:   $.extend( getExtendType( this.params.data ), this.params.data )
            };

            this.$elem.trigger('loadItems.init', {
                data: this.data.toLoad,
                params: this.params,
                template: this.$template
            });

            return this;
        },
        loadMore: function( config ) {
            var breakOn;

            if ( !! config ) {
                breakOn = parseParams( config ).count;

            } else {
                breakOn = this.params.count;
            }

            if ( ! $.isNumeric( breakOn ) ) {
                breakOn = 3;
            }

            var i = 0,
                length    = this.data.toLoad.length,
                canAppend = true,
                template  = {
                    data: null,
                    rendered: null,
                    compiled: Handlebars.compile( this.$template.html() )
                };

            for (; i < length; i++) {
                // Always get the first element
                template.data = this.data.toLoad[0];
                template.rendered = template.compiled( template.data );

                canAppend = this.$elem.trigger('loadItems.append.before', {
                    data: template.data,
                    element: template.rendered
                });

                if ( canAppend !== false ) {
                    this.$elem.append( template.rendered );
                    this.$elem.trigger('loadItems.append.after', {
                        data: template.data,
                        element: template.rendered
                    });

                    // Always removes the first element then in the next loop the second element will be the first
                    this.data.toLoad.shift();

                    if ( (i + 1) === breakOn ) {
                        break;
                    }
                }
            }

            if ( ! this.data.toLoad.length ) {
                this.$elem.trigger('loadItems.full');
            }

            return this;
        }
    };

    // Object.create support test, and fallback for browsers without it
    if ( typeof Object.create !== "function" ) {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    $.fn.loadItems = function(config) {
        return $(this).each(function() {
            var instance;

            if ( ! $.data( this, 'LoadItems' ) ) {
                instance = $.data( this, 'LoadItems', Object.create(LoadItems).init(config, this) );

            } else {
                instance = $.data( this, 'LoadItems' );
            }

            instance.loadMore( config );
        });
    };

})( jQuery, window, document );
