function typecaseSliderSelectSlide(e) {

    e.preventDefault();

    typecaseSliderSelectSlideFromThumb(e.currentTarget);

}

function typecaseSliderSelectSlideFromThumb(thumb) {

    if (! thumb.mySlider || ! thumb.mySlide) {
        return;
    }

    var active = thumb.mySlider.querySelector('.__active'),
    selected = thumb.mySlider.querySelector('.__selected');

    if (!! active) {
        active.classList.remove("__active");
    }

    if (!! selected) {
        selected.classList.remove("__selected");
    }

    thumb.mySlide.classList.add("__active");
    thumb.classList.add("__selected");

}

function typecaseSliderChangeSlide(thisSlider, direction) {

    var currentActive,
        nextSlide,
        slideSelector = thisSlider.getAttribute("data-slide-selector");
    
    currentActive = thisSlider.querySelector('.__active');

    if (direction == 'prev') {
        
        nextSlide = currentActive.previousElementSibling;

        if (!nextSlide || nextSlide.classList.contains('slide-controls')) {
            nextSlide = thisSlider.querySelector(slideSelector + ':last-of-type');
            currentActive.insertAdjacentElement('beforebegin', nextSlide);
        }

    } else {

        nextSlide = currentActive.nextElementSibling;
        
        if (nextSlide === null || nextSlide.tagName == "NAV") {
            nextSlide = thisSlider.querySelector(slideSelector + ':first-of-type');
            currentActive.insertAdjacentElement('afterend', nextSlide);
        }

    }

    thisSlider.classList.remove('transitioning');

    window.setTimeout(function (current, next, dir, slider) {

        current.classList.remove('__active');
        next.classList.add('__active');

        document.dispatchEvent(new CustomEvent('typecase|slide-changed', {detail: 
            { slider: slider, slide: next, direction: dir }
        }));
    
        slider.dispatchEvent(new CustomEvent('typecase|slide-changed', {detail: 
            { slide: next, direction: dir }
        }));

    }, 50, currentActive, nextSlide, direction, thisSlider);

}

function typecaseSliderClickNav(e) {

    var dir = e.currentTarget.classList.contains('prev') ? 'prev' : 'next',
        thisSlider = e.currentTarget.parentNode.parentNode;
        
    typecaseSliderChangeSlide(thisSlider, dir);

}

function typecaseSliderSwiped(e) {

    var thisSlider = e.currentTarget;
    
    typecaseSliderChangeSlide(thisSlider, e.detail.direction === 'left' ? 'next' : 'prev');

}

function typecaseSliderInstall(selector, slideSelector) {

    //console.log('typecaseSliderInstall(' + selector + ', ' + slideSelector + ')');

    if (selector === undefined) {
        selector = ".wp-block-typecase-slider"
    }

    //console.log( selector );

    if (slideSelector === undefined) {
        slideSelector = selector + "-slide";
    }

    //console.log( slideSelector );

    var sliders;

    if (typeof selector === "string") {
        sliders = document.querySelectorAll(selector);
    } 
    else if (typeof selector === "object") {
        if (selector.length) {
            sliders = selector;
        } else {
            sliders = [selector];
        }
    } 
    else {
        return false;
    }

    //console.log( sliders );

    for(var i = 0; i < sliders.length; i += 1) {

        var controls = document.createElement('nav'),
            prevSlideButton = document.createElement('button'),
            nextSlideButton = document.createElement('button'),
            slides = sliders[i].querySelectorAll(slideSelector);

        //console.log( slides );

        var first = sliders[i].querySelector(slideSelector + ':first-of-type');
        if (first) {
            first.classList.add('__active');
        } else {
            continue;   
        }

        controls.classList.add('slider-controls');

        prevSlideButton.classList.add('slider-controls--button');
        prevSlideButton.classList.add('prev');
        prevSlideButton.innerHTML = '<span>Previous</span>';
        prevSlideButton.addEventListener('click', typecaseSliderClickNav);

        nextSlideButton.classList.add('slider-controls--button');
        nextSlideButton.classList.add('next');
        nextSlideButton.innerHTML = '<span>Next</span>';
        nextSlideButton.addEventListener('click', typecaseSliderClickNav);

        controls.appendChild(prevSlideButton);
        controls.appendChild(nextSlideButton);

        sliders[i].appendChild(controls);

        

        sliders[i].classList.add('__ready');
        sliders[i].classList.add('is-typecase-slider');

        sliders[i].setAttribute("data-slide-selector", slideSelector);   
        
        for (var s = 0; s < slides.length; s += 1) 
        {
            if (!! slides[s].id) 
            {
                var triggers = document.querySelectorAll('a[href="#' + slides[s].id + '"]');
                for (var n = 0; n < triggers.length; n += 1) 
                {
                    triggers[n].mySlider = sliders[i];
                    triggers[n].mySlide = slides[s];
                    triggers[n].addEventListener('click', typecaseSliderSelectSlide);
                }
            }
        }

        var zone = new Swipr(sliders[i]);

        zone.addEventListener("swipr|swiped", typecaseSliderSwiped);
        sliders[i].dispatchEvent(new Event('typecase|slider-installed')); 
        
    }

}

(function () {

    typecaseSliderInstall();

    document.dispatchEvent(new Event('typecase|installed'));

}())