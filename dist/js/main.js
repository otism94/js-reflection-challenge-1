"use strict";var headerHeight=0;$(document).ready(function(){headerHeight=$("header").outerHeight()}),$(window).resize(function(){headerHeight!==$("header").outerHeight()&&(headerHeight=$("header").outerHeight())});var stickyOptions={offset:-1,offsetSide:"top",classes:{clone:"header--clone",stick:"header--stick",unstick:"header--unstick"}},stickyHeader=new Headhesive("header",stickyOptions),lastScrollTop=0;$(window).scroll(function(e){var t=$(this).scrollTop(),a=document.getElementsByClassName("header--clone");lastScrollTop<t?(t<=headerHeight||$(a[0]).show(),$(a[0]).removeClass("header--stick"),$(a[0]).addClass("header--unstick")):0===t?$(a[0]).hide():t<=headerHeight||($(a[0]).removeClass("header--unstick"),$(a[0]).addClass("header--stick")),lastScrollTop=t}),$("#banner-carousel").slick({autoplay:!0,autoplaySpeed:5e3,arrows:!1,dots:!0});var bannerButtons=document.querySelectorAll(".btn-banner");console.log(bannerButtons);for(var i=0;i<bannerButtons.length;i++)bannerButtons[i].firstElementChild.textContent+="     ";