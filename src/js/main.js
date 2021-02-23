/**
 * Scroll Lock
 */
$.scrollLock = ( function scrollLockClosure() {
    'use strict';

    var $html      = $( 'html' ),
        // State: unlocked by default
        locked     = false,
        // State: scroll to revert to
        prevScroll = {
            scrollLeft : $( window ).scrollLeft(),
            scrollTop  : $( window ).scrollTop()
        },
        // State: styles to revert to
        prevStyles = {},
        lockStyles = {
            'overflow-y' : 'scroll',
            'position'   : 'fixed',
            'width'      : '100%'
        };

    // Instantiate cache in case someone tries to unlock before locking
    saveStyles();

    // Save context's inline styles in cache
    function saveStyles() {
        var styleAttr = $html.attr( 'style' ),
            styleStrs = [],
            styleHash = {};

        if( !styleAttr ){
            return;
        }

        styleStrs = styleAttr.split( /;\s/ );

        $.each( styleStrs, function serializeStyleProp( styleString ){
            if( !styleString ) {
                return;
            }

            var keyValue = styleString.split( /\s:\s/ );

            if( keyValue.length < 2 ) {
                return;
            }

            styleHash[ keyValue[ 0 ] ] = keyValue[ 1 ];
        } );

        $.extend( prevStyles, styleHash );
    }

    function lock() {
        var appliedLock = {};

        // Duplicate execution will break DOM statefulness
        if( locked ) {
            return;
        }

        // Save scroll state...
        prevScroll = {
            scrollLeft : $( window ).scrollLeft(),
            scrollTop  : $( window ).scrollTop()
        };

        // ...and styles
        saveStyles();

        // Compose our applied CSS
        $.extend( appliedLock, lockStyles, {
            // And apply scroll state as styles
            'left' : - prevScroll.scrollLeft + 'px',
            'top'  : - prevScroll.scrollTop  + 'px'
        } );

        // Then lock styles...
        $html.css( appliedLock );

        // ...and scroll state
        $( window )
            .scrollLeft( 0 )
            .scrollTop( 0 );

        locked = true;
    }

    function unlock() {
        // Duplicate execution will break DOM statefulness
        if( !locked ) {
            return;
        }

        // Revert styles
        $html.attr( 'style', $( '<x>' ).css( prevStyles ).attr( 'style' ) || '' );

        // Revert scroll values
        $( window )
            .scrollLeft( prevScroll.scrollLeft )
            .scrollTop(  prevScroll.scrollTop );

        locked = false;
    }

    return function scrollLock( on ) {
        // If an argument is passed, lock or unlock depending on truthiness
        if( arguments.length ) {
            if( on ) {
                lock();
            }
            else {
                unlock();
            }
        }
        // Otherwise, toggle
        else {
            if( locked ){
                unlock();
            }
            else {
                lock();
            }
        }
    };
}() );

/**
 * Sticky header
 */
// Get header height on document load and window resize
let headerHeight = 0;
$(document).ready(() => headerHeight = $('#topbar').outerHeight());
$(window).resize(() => {
    if (headerHeight !== $('#topbar').outerHeight()) {
        headerHeight = $('#topbar').outerHeight();
    }
});

// Clone header
const createHeaderClone = () => {
    const clonedHeader = $('#topbar').clone();
    clonedHeader.prop('id', 'topbar-clone');
    $('#header-space').append(clonedHeader);
};

// Unclone header
const removeHeaderClone = () => $('#topbar-clone').remove();

// Sticky header event listener
let fromSideMenu = false;
let lastScrollTop = 0;
$(window).on('scroll', () => {
    // Opening/closing sidebar causes a scroll; do nothing if this is the case
    if (!fromSideMenu) {
        clearTimeout($.data($(this), 'scrollTimer'));
        // Fire scroll event if haven't scrolled in 200ms
        $.data($(this), 'scrollTimer', setTimeout(() => {
            const st = $(window).scrollTop();

            // Scroll down main event
            if (st > lastScrollTop) {
                if ($('#topbar').css('position') === 'fixed') {
                    $('#topbar').animate({top: -headerHeight}, 200, () => {
                        $('#topbar').css({'position': 'absolute',
                                          'box-shadow': 'none'})
                                    .animate({top: 0}, 0, () => {
                            fromSideMenu = false;
                            removeHeaderClone();
                        });
                    });
                }
        
            // Unstick header if scrolled all the way to the top
            } else if (st === 0 && $('#topbar').css('position') === 'fixed') {
                $('#topbar').animate({top: 0}, 0, () => {
                    $('#topbar').css({'position': 'absolute',
                                      'box-shadow': 'none'});
                    removeHeaderClone();
                });
        
            // Empty condition to prevent sticky header appearing when scrolling up while in static header range
            } else if (st <= headerHeight) {
        
            // Scroll up main event
            } else if (st < lastScrollTop && st > headerHeight) {
                if ($('#topbar').css('position') === 'absolute') {
                    createHeaderClone();
                    $('#topbar').animate({top: -headerHeight}, 0, () => {
                        $('#topbar').css({'position': 'fixed',
                                          'box-shadow': '0 0 30px rgba(0, 0, 0, .15)'})
                                    .animate({top: 0}, 200);
                    });
                }
            }
            lastScrollTop = st;
        }, 200));
    }
});

/**
 * Side menu / Hamburger
 */
$('.menu-btn').click(() => {
    fromSideMenu = true;
    $('.menu-btn').toggleClass('is-active');
    $.scrollLock(true);
});

$('.site-overlay').click(() => {
    setTimeout(() => {fromSideMenu = false}, 200);
    $('.menu-btn').toggleClass('is-active');
    $.scrollLock(false);
    
});

/**
 * Banner carousel
 */
// Carousel options
$('#banner-carousel').slick({
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    dots: true
});

// Additional formatting for the banner buttons
const bannerButtons = document.querySelectorAll('.btn-banner');
for (let i = 0; i < bannerButtons.length; i++) {
    bannerButtons[i].firstElementChild.textContent += `\xa0\xa0\xa0\xa0\xa0`;
}

/**
 * Cookies popup
 */
$(document).ready(function() {
    if(localStorage.getItem('eucookie') != '123'){
        $('#privacy-popup').css('display', 'flex');
        $.scrollLock(true);
    } 
    $('#cookies-accept').click(function() { 
        jQuery('#privacy-popup').css('display', 'none');
        localStorage.setItem('eucookie','123');
        $.scrollLock(false);
    });
});