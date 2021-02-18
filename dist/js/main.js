"use strict";

var fromSideMenu = 0;
/**
 * Scroll Lock
 */

$.scrollLock = function scrollLockClosure() {
  'use strict';

  var $html = $('html'),
      // State: unlocked by default
  locked = false,
      // State: scroll to revert to
  prevScroll = {
    scrollLeft: $(window).scrollLeft(),
    scrollTop: $(window).scrollTop()
  },
      // State: styles to revert to
  prevStyles = {},
      lockStyles = {
    'overflow-y': 'scroll',
    'position': 'fixed',
    'width': '100%'
  }; // Instantiate cache in case someone tries to unlock before locking

  saveStyles(); // Save context's inline styles in cache

  function saveStyles() {
    var styleAttr = $html.attr('style'),
        styleStrs = [],
        styleHash = {};

    if (!styleAttr) {
      return;
    }

    styleStrs = styleAttr.split(/;\s/);
    $.each(styleStrs, function serializeStyleProp(styleString) {
      if (!styleString) {
        return;
      }

      var keyValue = styleString.split(/\s:\s/);

      if (keyValue.length < 2) {
        return;
      }

      styleHash[keyValue[0]] = keyValue[1];
    });
    $.extend(prevStyles, styleHash);
  }

  function lock() {
    var appliedLock = {}; // Duplicate execution will break DOM statefulness

    if (locked) {
      return;
    } // Save scroll state...


    prevScroll = {
      scrollLeft: $(window).scrollLeft(),
      scrollTop: $(window).scrollTop()
    }; // ...and styles

    saveStyles(); // Compose our applied CSS

    $.extend(appliedLock, lockStyles, {
      // And apply scroll state as styles
      'left': -prevScroll.scrollLeft + 'px',
      'top': -prevScroll.scrollTop + 'px'
    }); // Then lock styles...

    $html.css(appliedLock); // ...and scroll state

    $(window).scrollLeft(0).scrollTop(0);
    locked = true;
  }

  function unlock() {
    // Duplicate execution will break DOM statefulness
    if (!locked) {
      return;
    } // Revert styles


    $html.attr('style', $('<x>').css(prevStyles).attr('style') || ''); // Revert scroll values

    $(window).scrollLeft(prevScroll.scrollLeft).scrollTop(prevScroll.scrollTop);
    locked = false; // Set header to fixed

    if (prevScroll.scrollTop > headerHeight) {
      fromSideMenu = true;
      $('#topbar').css('position', 'fixed');
    }
  }

  return function scrollLock(on) {
    // If an argument is passed, lock or unlock depending on truthiness
    if (arguments.length) {
      if (on) {
        lock();
      } else {
        unlock();
      }
    } // Otherwise, toggle
    else {
        if (locked) {
          unlock();
        } else {
          lock();
        }
      }
  };
}();
/**
 * Sticky header
 */
// Get header height on document load and window resize


var headerHeight = 0;
$(document).ready(function () {
  return headerHeight = $('#topbar').outerHeight();
});
$(window).resize(function () {
  if (headerHeight !== $('#topbar').outerHeight()) {
    headerHeight = $('#topbar').outerHeight();
  }
}); // Trigger the sticky header

var lastScrollTop = 0;
var stickyTriggered = false;
$(window).scroll(function () {
  var st = $(window).scrollTop(); // Scroll down main event

  if (st > lastScrollTop && !stickyTriggered && !fromSideMenu) {
    if ($('#topbar').css('position') === 'fixed') {
      stickyTriggered = true;
      $('#topbar').delay(200).animate({
        top: -headerHeight
      }, 200, function () {
        $(this).css('position', 'absolute').animate({
          top: 0
        }, 0, function () {
          return stickyTriggered = false;
        });
      });
    } // Empty condition to prevent sticky header appearing when scrolling up while in static header range

  } else if (st <= headerHeight) {// Scroll up main event
  } else if (st < lastScrollTop && st > headerHeight && !stickyTriggered) {
    if ($('#topbar').css('position') === 'absolute') {
      stickyTriggered = true;
      $('#topbar').animate({
        top: -headerHeight
      }, 0, function () {
        $(this).delay(200).css('position', 'fixed').animate({
          top: 0
        }, 200, function () {
          return stickyTriggered = false;
        });
      });
    }
  }

  lastScrollTop = st;
});
/**
 * Side menu / Hamburger
 */

$('.menu-btn').click(function () {
  $('.menu-btn').toggleClass('is-active');
  $.scrollLock(true);
});
$('.site-overlay').click(function () {
  $('.menu-btn').toggleClass('is-active');
  setTimeout(function () {
    fromSideMenu = false;
  }, 1);
  $.scrollLock(false);
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
var bannerButtons = document.querySelectorAll('.btn-banner');

for (var i = 0; i < bannerButtons.length; i++) {
  bannerButtons[i].firstElementChild.textContent += "\xA0\xA0\xA0\xA0\xA0";
}
/**
 * Cookies popup
 */


$(document).ready(function () {
  if (localStorage.getItem('eucookie') != '123') {
    $('#privacy-popup').css('display', 'flex');
  }

  $('#cookies-accept').click(function () {
    jQuery('#privacy-popup').css('display', 'none');
    localStorage.setItem('eucookie', '123');
  });
});