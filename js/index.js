console.time('DOMContentLoaded');
var styles = require('../styles/main.less');
var PathData = require('./PathData.js');

//
Path2D.prototype.addPath = (function(addPath) {
    return function(path, m) {
        if (typeof path === 'string') {
            return new Path2D(m ? path.replace(/^M(\d+)[\s,](\d+)/, 'M' + (m.e || '$1') + ' ' + (m.f || '$2')) : path);
        }
        return addPath.apply(this, arguments);
    };
})(Path2D.prototype.addPath);

/* animation classes list
 -- add .animation-splash-in to .app
 -- wait 0.8s after end of animation then add .animation-intro-in to .app
 -- wait 1s after end of animation then add .animation-video-in to .app
 -- play video
 -- click button then add .animation-cities-in to .app
 -- when click .cities__city then add .active class to it and add .selected class to needed .notifier
 -- wait 0.8s after end of animation then add .animation-notifier-in to .app
 -- click button then add .animation-download-in to .app
 */
;(function(
    document,
    requestAnimationFrame,
    setTimeout,
    cancelAnimationFrame,
    addEventListener
){
    var CLASS_ANIMATION_SPLASH_IN = 'animation-splash-in';
    var CLASS_ANIMATION_INTRO_IN = 'animation-intro-in';
    var CLASS_ANIMATION_VIDEO_IN = 'animation-video-in';
    var CLASS_ANIMATION_CITIES_IN = 'animation-cities-in';
    var CLASS_ANIMATION_NOTIFIER_IN = 'animation-notifier-in';
    var CLASS_ANIMATION_DOWNLOAD_IN = 'animation-download-in';
    var CLASS_LIKES_HEART = 'likes__heart';
    var CLASS_CITY_ACTIVE = 'active';
    var CLASS_CITIES_FOOTER_ACTIVE = 'active';
    var CLASS_NOTIFIER_ACTIVE = 'selected';

    var VIDEO_CARD_BUTTON_CLICKED = 'video-card__button--clicked';

    document.addEventListener('DOMContentLoaded', main);

    function main() {
        var app = document.querySelectorAll('.app')[0];
        var video = document.querySelectorAll('.video-card__video')[0];
        var videoCardButton = document.querySelectorAll('.video-card__button')[0];
        var citiesCardFooter = document.querySelectorAll('.cities-card__cities-footer')[0];
        var notifierButtons = document.querySelectorAll('.notifier__button');
        var cities = document.querySelectorAll('.cities__city');
        var _this = this;
        var s = 1000;
        var classList = app.classList;
        var animation;
        var canvases = document.querySelectorAll('.' + CLASS_LIKES_HEART);

        console.timeEnd('DOMContentLoaded');

        //var VIDEO_CARD_BUTTON_CLICKED_EVENT = new CustomEvent(VIDEO_CARD_BUTTON_CLICKED);
        video.src = './media/video/video.mp4';

        // add .animation-splash-in to .app
        classList.add(CLASS_ANIMATION_SPLASH_IN);
        console.time(CLASS_ANIMATION_SPLASH_IN);

        // wait 0.8s after end of animation then add .animation-intro-in to .app
        setTimeout(function(){
            cancelAnimationFrame(animation);
            animation = requestAnimationFrame(introIn, 0);
        }, 0.8 * s);

        // click button then add .animation-cities-in to .app
        videoCardButton.addEventListener('click', clickOnVideoCardButton);
        notifierButtons.forEach(function(button){
            button.addEventListener('click', clickOnNotifierButton);
        });

        canvases.forEach(drawHeart);
        cities.forEach(function(city){
            city.addEventListener('click', clickOnCity);
        });

        //addEventListiner(VIDEO_CARD_BUTTON_CLICKED, function(){});

        function drawHeart(canvas){
            var path = new Path2D();
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
                var draw = draw2D.bind({}, ctx, path);
                var d = icon_heart.children[0].getAttribute('d');
                var pd = new PathData(d);
                //var drawHeart = draw.bind({}, d);
                var drawHeart = draw.bind({}, pd.scale(.5).toString());
                var drawRedHeart = drawHeart.bind({}, {
                    fillStyle: '#f00'
                });
                drawRedHeart(90, 50);
            }
        }

        // wait 1s after end of animation then add .animation-video-in to .app
        function introIn(){
            console.timeEnd(CLASS_ANIMATION_SPLASH_IN);
            classList.add(CLASS_ANIMATION_INTRO_IN);
            console.time(CLASS_ANIMATION_INTRO_IN);
            setTimeout(function(){
                cancelAnimationFrame(animation);
                animation = requestAnimationFrame(videoIn, 0);
            }, 1 * s);
        }

        // play video
        function videoIn(){
            console.timeEnd(CLASS_ANIMATION_INTRO_IN);
            classList.add(CLASS_ANIMATION_VIDEO_IN);
            video.play();
        }

        function clickOnVideoCardButton(){
            //dispatchEvent(VIDEO_CARD_BUTTON_CLICKED_EVENT);
            video.pause();
            classList.add(CLASS_ANIMATION_CITIES_IN);
        }
        function clickOnNotifierButton(){
            classList.add(CLASS_ANIMATION_DOWNLOAD_IN);
        }

        function clickOnCity(){
            var target = this;
            var notifier = document.querySelectorAll('.notifier__' + target.id)[0];

            // TODO: Refactor as Observer
            // Activate city
            target.parentNode.querySelectorAll('.city').forEach(function(city){
                city.classList.remove(CLASS_CITY_ACTIVE);
            });
            target.classList.add(CLASS_CITY_ACTIVE);
            classList.add(CLASS_ANIMATION_NOTIFIER_IN);

            // Activate notifier
            if(notifier && notifier.classList){
                target.parentNode.querySelectorAll('.notifier').forEach(function(notifier){
                    notifier.classList.remove(CLASS_NOTIFIER_ACTIVE);
                });
                notifier.classList.add(CLASS_NOTIFIER_ACTIVE);
            }

            // Activate footer
            citiesCardFooter.classList.add(CLASS_CITIES_FOOTER_ACTIVE);

            setTimeout(function(){
                cancelAnimationFrame(animation);
                animation = requestAnimationFrame(introIn, 0);
            }, 0.8 * s);
        }

        function draw2D(ctx, path, d, options, e, f){
            Object.assign(ctx,options);
            ctx.fill(d?path.addPath(d,{e:e,f:f}):path);
        }
    }
}(
    document,
    requestAnimationFrame || setTimeout,
    setTimeout,
    cancelAnimationFrame || Function(),
    addEventListener
));