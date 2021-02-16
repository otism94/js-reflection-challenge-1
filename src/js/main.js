// $(document).ready(function(){
//     $("header").sticky({topSpacing:0});
// });

// var lastScrollTop = 0;
// $(window).scroll(function(event){
//     var st = $(this).scrollTop();
//     if (st > lastScrollTop){
//         // downscroll code
//     } else {
//         // upscroll code
//         $("header").sticky({topSpacing:0});
//     }
//     lastScrollTop = st;
// });

// $(document).ready(function() {
//     const headers = document.getElementsByTagName('header');
//     for (let i = 0; i < headers.length; i++) {
//         const thisElement = headers[i];
//         if (!thisElement.classList.contains('header--clone')) {
//             $(thisElement).css('visibility', 'hidden');
//         }
//     }
// });

/**
 * Sticky header
 */

let headerHeight = 0;

$(document).ready(function() {
    headerHeight = $('header').outerHeight();
});

$(window).resize(function() {
    if (headerHeight !== $('header').outerHeight()) {
        headerHeight = $('header').outerHeight();
    }
});

// Options
const stickyOptions = {
    offset: -1,
    offsetSide: 'top',
    classes: {
        clone:   'header--clone',
        stick:   'header--stick',
        unstick: 'header--unstick'
    }
};

const stickyHeader = new Headhesive('header', stickyOptions);

let lastScrollTop = 0;
$(window).scroll(function(event){
    const st = $(this).scrollTop();
    const headerClone = document.getElementsByClassName('header--clone');
    if (st > lastScrollTop){ // Scroll down
        if (st <= headerHeight) { // Do not stick header when static header is visible
            $(headerClone[0]).removeClass('header--stick');
            $(headerClone[0]).addClass('header--unstick');
        } else { // Stick header
            $(headerClone[0]).show();
            $(headerClone[0]).removeClass('header--stick');
            $(headerClone[0]).addClass('header--unstick');
        }
    } else if (st === 0) { // Remove sticky header without an animation if scrolled to the very top
        $(headerClone[0]).hide();
    } else if (st <= headerHeight) {
        // Prevents sticky header appearing when scrolling up while static header is visible
    } else { // Show header when scrolling up
        $(headerClone[0]).removeClass('header--unstick');
        $(headerClone[0]).addClass('header--stick');
    }
    lastScrollTop = st;
});

/**
 * Banner carousel
 */
$('#banner-carousel').slick({
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dots: true
});

const bannerButtons = document.querySelectorAll('.btn-banner');
console.log(bannerButtons);
for (let i = 0; i < bannerButtons.length; i++) {
    bannerButtons[i].firstElementChild.textContent += `\xa0\xa0\xa0\xa0\xa0`;
}