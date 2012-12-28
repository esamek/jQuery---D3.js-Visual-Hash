(function($){

    var optionDefaults = {
        'numberOfColors': 5
    };

    var scale = d3.scale.ordinal()
                .range(['#000000','#ffffff']);


    function visualHash(el,options){
        this.$el = $(el);
        options = options || {};
        this.settings = $.extend(optionDefaults,options);
        this.init();

        return el;
    }

    visualHash.prototype = {


        init: function(){
            var d = this.checkDependencies();
            if(d){
                alert('Could not find ' + d);

            }else {
                this.colorScale = d3.scale.category20c();
                this.drawColors();
                this.events();
            }
        },

        events: function(){
            var that = this;

            this.$el.on('change.viz keyup.viz', function(e){
                var hash = that.doHash(that.$el.val());
                var hashArray = that.interpolate(hash);
                var colors = that.getColors(hashArray);
                that.updateColors(colors);
            });
        },

        checkDependencies: function(){
            var crypto = window.CryptoJS ? false : " CryptoJS ";
            var d3 = window.d3 ?  false : " d3.js ";
            if(!d3 && !crypto){
                return false;
            }else {
                return crypto + d3;
            }
        },

        doHash: function(val){
            var hash = CryptoJS.SHA512(val);
            return hash.toString();
        },

        interpolate: function(hash){
            var hashSub = [];
            var interval = hash.length / this.settings.numberOfColors;
            for(var i = 0; i < hash.length; i+=interval){
                hashSub.push(hash.substring(i,i+interval));
            }
            return hashSub;

        },

        getColors: function(hashArray){
            for(var i = 0; i < hashArray.length;i++){
                var h = hashArray[i];
                hashArray[i] = this.colorScale(h);
            }
            return hashArray;
        },

        drawColors: function(){
            var that = this;
            var $wrap = $('<div />',{
                css: {
                    'display'  : that.$el.css('display'),
                    'position' : 'relative'
                }
            });
            $wrap.addClass('visual-hash-wrap');
            var $colorEl = $('<div />',{
                css: {
                    'position' : 'absolute',
                    'width'    : '20px',
                    'height'   : '20px'
                }
            });
            var w = this.$el.outerWidth();

            this.$el.wrap($wrap);
            for(var i = 0; i < this.settings.numberOfColors - 1;i++){
                var $c = $colorEl.clone();
                $c.css({
                    'top' : '0',
                    'left': w + (i+1) * 20
                });
                $c.addClass('pw-color pw-color' + i);

                $c.appendTo('.visual-hash-wrap');
            }
        },

        updateColors : function(colors){
            $('.visual-hash-wrap .pw-color').each(function(index){
                $(this).css('background-color',colors[index]);
            });
        }


    };//end prototype


    $.fn.visualHash = function(options){
        return new visualHash(this,options);
    };


})(jQuery);