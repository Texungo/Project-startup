;(function ( $, window, document, undefined ) {
    "use strict";

    var isJson = function( str ) {
        try {
            JSON.parse( str );

        } catch ( e ) {
            return false;
        }

        return true;
    };


   /* FileUploader Class
    * =================================== */
    var FileUploader = function( $element, options ) {
        if ( ! Mustache ) {
            console.error('FileUploader: missing "Mustache - Logic-less templates" plugin: http://mustache.github.io/');
            return false;
        }

        var self = this;

        this.options = $.extend({
            selectors: {
                input:             '.fileuploader-input',
                button:            '.fileuploader-add-file .input-append',
                uploader:          '.fileuploader-add-file [type="file"]',
                uploaderContainer: '.uploader-container',
                renderTarget:      '.new-files',
                renderTemplate:    '#fileuploader-template'
            }
        }, options || {});

        this.maxFiles  = -1;
        this.$input    = $element.find( this.options.selectors.input );
        this.$button   = $element.find( this.options.selectors.button );
        this.$uploader = $element.find( this.options.selectors.uploader );



        if ( !!this.$uploader.length && !!parseInt( this.$uploader.attr( 'maxlength' ) ) ) {
            this.maxFiles = parseInt( this.$uploader.attr( 'maxlength' ) );
        }


        if ( isJson( this.$input.val() ) ) {
            // Parsing json from input to check max upload count
            var value = JSON.parse( this.$input.val() );

            if ( $.isArray( value ) ) {
                this.maxFiles = Math.max(0, this.maxFiles - value.length);
            }
        }

        if ( this.maxFiles <= 0 ) {
            this.$button.hide();
        }

        this.render = {
            '$target': $element.find( this.options.selectors.renderTarget ),
            'template':  (function() {
                var template = $( self.options.selectors.renderTemplate );

                if ( !template.length || !template.html() ) {
                    console.error("FileUploader: Mustache Script \"" + self.options.selectors.renderTemplate + "\" doesn't exists or is empty");
                    return false;

                } else {
                    return template.html();
                }
            })()
        };

        this.$uploader.on( 'change', function( e ) {
            self.addRows( e );
        });

        $element.on( 'click', '[data-remove]', function( e ) {
            self.removeRow( $( this ), e);
        });

        return this;
    };


    // Public method
    FileUploader.prototype.checkMaxFiles = function() {
        if (this.maxFiles === 0) {
            this.$button.hide();

        } else {
            this.$button.show();
        }
    };

    // Public method
    FileUploader.prototype.addRows = function( e ) {
        var self = this, file;

        if (this.maxFiles === 0) {
            console.warn( "FileUploader: Max files reached" );
            return false;
        }

        if (e.target.files !== undefined) {
            file = e.target.files[0];

        } else if ( e.target.value ) {
            file = { name: e.target.value.replace(/^.+\\/, '') };

        } else {
            console.warn( "FileUploader: There is no file to add" );
            return false;
        }


        // Private function
        var render = function( data ) {
            var $rendered, renderedHtml;

            if ( !self.render.$target || !self.render.template || !data ) {
                console.error( "FileUploader: target, render template or data is invalid", self.render.$target, self.render.template, data );
                return false;

            } else {
                renderedHtml = Mustache.render( self.render.template, data );

                if ( !!renderedHtml ) {
                    $rendered = $( renderedHtml );
                    self.render.$target.prepend( $rendered );

                    return $rendered;

                } else {
                    console.error( "FileUploader: Rendered Mustache content is not valid", { "template": self.render.template }, { "data": data } );
                    return false;
                }
            }
        };

        // Private function
        var duplicate = function( $input ) {

            if ( !$input.length ) {
                console.error( "FileUploader: Element doesn't exists ", $input );
                return false;
            }

            var $inputClone = $input.clone( true ),
                $inputOriginal;

            $input.after( $inputClone );
            $inputOriginal = $input.detach();
            $input = $inputClone;

            return $inputOriginal;
        };

        var $rendered, $fileUploader = duplicate( this.$uploader );

        if ( !$fileUploader || !$fileUploader.length ) {
            console.error( "FileUploader: duplicated input is invalid: ", $fileUploader );
            return false;
        }


        $rendered = render({ 'file': file });

        if ( !!$rendered && !!$rendered.length ) {
            var value, $uploaderContainer = $rendered.find( this.options.selectors.uploaderContainer );

            $fileUploader.appendTo( $uploaderContainer );

            this.maxFiles = Math.max( 0, this.maxFiles - 1 );

            this.checkMaxFiles();

            // Parsing json from input to add file name
            if ( isJson( this.$input.val() ) ) {
                value = JSON.parse( this.$input.val() );
            }

            if ( !$.isArray( value ) ) value = [];
            value.push( file.name );

            this.$input.val( JSON.stringify( value ) );
        }
    };

    // Public method
    FileUploader.prototype.removeRow = function( trigger, e ) {
        e.preventDefault();
        var value, name = trigger.data( 'remove' );

        trigger.parents( '[data-name="' + name + '"]' ).remove();

        if ( isJson( this.$input.val() ) ) {
            value = JSON.parse( this.$input.val() );
        }

        if ( !$.isArray( value ) ) {
            value = [];

        } else {
            var index = value.indexOf( name );

            if ( index > -1 ) value.splice( index, 1 );
        }

        this.maxFiles++;
        this.checkMaxFiles();

        this.$input.val( JSON.stringify( value ) );
    };

    $.fn.fileuploader = function() {
        return this.each(function() {
            $( this ).data( 'FileUploader', new FileUploader( $( this ) ) );
        });
    };

    $( document ).on( 'ready ajaxComplete', function() {
        $( '.fileuploader-container:not(.ready)' ).fileuploader().addClass( 'ready' );
    });

})( jQuery, window, document );
