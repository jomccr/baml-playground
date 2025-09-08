/* --------------------------------------
=========================================
ADMAG - Responsive Blog & Magazine Wordpress Template
Version: 1.0
Designed by: DigitalTheme.co
=========================================

1. Bootstrap tooltip
2. Bootstrap Select First Tab
3. Tabs hover effect
4. Menu hover effect
5. Fade effect on Menu and Tab
6. Slider
7. Image popup
8. Sticky Sidebar
9. Mobile Menu
10. Mobile Menu Scrollbar
11. Responsive video
12. Sticky Header
13. Fixed Sidebar Scrollbar
14. Go to Top Button
15. Count up share counter
16. Google Map
-----------------------------------------*/

jQuery(function ($) {
   "use strict";

    $(document).ready( function(){

      var $_html = $("html");
      var $_body = $("body");
      var $_header_room = $('.sticky-headroom #header');
      var $_header_menu = $('.sticky-header #header');
      var $_stickyScrollbar = $('.sticky-scroll');
      var $_sidebar = $("#sticky-sidebar");
      var $_goTop = $('#go-top-button');
      var $_header_topoffset = 0;
      var $_offset = 133;

      // 1. Bootstrap tooltip
      var $_tooltip = $('[data-toggle="tooltip"]');
      if ( $_tooltip.length ) {
        $_tooltip.tooltip();
      }

      // 2. Bootstrap Select First Tab
      var $_tab1 = $('#widget-tab a:first');
      if( $_tab1.length ){
        $_tab1.tab('show');
      }

      // 3. Tabs hover effect
      $('.tab-hover .nav-tabs > li > a').hover(function(){
          $(this).tab('show');
      });

      // 4. Menu hover effect
      $('.dropdown-toggle').dropdownHover();

      // 5. Mega menu
      $('a[data-href]').each(function() {
        $(this).on('click', function(e){
          e.preventDefault();
          window.location.href = $(this).attr('data-href');
        });
      });

      // First mega menu tab show
      var $_megatab = $('.tab-hover .nav-tabs > li > a');

      if( $_megatab.length ){
        // On tab show event
        $_megatab.on("show.bs.tab", function(e){
          var $_tabcontent = $( $(this).attr("href") );

          if( $_tabcontent.length ){
            // if tab content is empty
            if( $_tabcontent.is(':empty') ){
              // ajax call
              $_tabcontent.addClass("loading");

              var data = {
                'action': 'dt_tabbed_mega_blocks',
                category: $(this).attr('data-mega-cat')
              };

              $.post(ajaxurl, data, function(response) {
                $_tabcontent.html(response);
                $_tabcontent.removeClass("loading");
              });
            }
          }

        });
      }

      $("#main-nav .mega-menu3>a").on("hover", function () {
        var $_id = $(this).attr('data-mega-cat');
        $_id = $("#nav-href" + $_id);

        if( $_id.length ){
           $_id.tab('show');
        }
      });

      //$("#main-nav .mega-menu2").append('<ul class="dropdown-menu fullwidth"><li><div class="mega-menu-wrapper"></div></li></ul>');

      // Full mega menu
      // var dt_link_wrapper = $("#main-nav .mega-menu2>.dropdown-toggle");

      // dt_link_wrapper.on("hover", function () {

      //   var wrapper = $(this).parent().find('.mega-menu-wrapper');

      //   if( wrapper.is(':empty') ){
      //     // Full Mega Menu
      //     wrapper.addClass("loading");
      //     var data = {
      //       'action': 'dt_mega_blocks',
      //       category: $(this).attr('data-mega-cat')
      //     };

      //       $.post(ajaxurl, data, function(response) {
      //         wrapper.html(response);
      //         wrapper.removeClass("loading");
      //       });
      //   }

      // });

      // 5. Fade effect on Menu and Tab
      $('.nav .dropdown-menu').addClass('animated fadeIn');
      $('.tab-pane').addClass('animated fadeIn');

      if( $_html.hasClass("no-touch") ){
         $('.navbar .dropdown > a').on("click", function(){
            location.href = this.href;
         });
      }

      // 6. Slider
      var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        loop: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        autoplay: 3000,
      });

      // 7. Image popup
      $('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"]').each(function(){
          if ($(this).parents('.gallery').length == 0) {
              $(this).magnificPopup({
                  type:'image',
                  mainClass: 'mfp-with-zoom', // this class is for CSS animation below
                  closeOnContentClick: true,
                  zoom: {
                      enabled: true, // By default it's false, so don't forget to enable it

                      duration: 200, // duration of the effect, in milliseconds
                      easing: 'ease-in-out', // CSS transition easing function

                      opener: function(openerElement) {
                         return openerElement.is('img') ? openerElement : openerElement.find('img');
                      }
                   }
                  });
              }
          });
      $('.gallery').each(function() {
          $(this).magnificPopup({
              delegate: 'a',
              type: 'image',
              gallery: {enabled: true}
              });
          });


      // 8. Sticky Sidebar
      $('.dt_content, .dt_sidebar').theiaStickySidebar({
        // Settings
        additionalMarginTop: 60
      });

      // 9. Mobile Menu
      var $_mob_nav = $('#mobile-nav');
      if( $_mob_nav.length ){
        $_mob_nav.mmenu({
          slidingSubmenus: false,
          extensions: ["theme-dark"]
        }, {

        });
      }

      // 10. Mobile Menu Scrollbar
      var $_mob = $('.mm-panels > .mm-panel');
      if( $_mob.length ){
        $_mob.perfectScrollbar({
           wheelSpeed: 1,
           suppressScrollX: true
        });
      }

      $('#fixed-button').on("click", function(event){
         event.preventDefault();
         $_html.toggleClass("ad-opened");
      });

      $('#mobile-overlay').on("click", function(event){
         event.preventDefault();
         $_html.toggleClass("ad-opened");
      });

      // 11. Responsive video
      $(".image-overlay").fitVids();

      // 12. Sticky Header
      if( !$_body.hasClass('fixed-sidebar') ){
         // Sticky menu hide
         $_header_room.headroom({
           "offset": 500,
           "tolerance": 0,
           "classes": {
             "initial": "animated",
             "pinned": "slideDown",
             "unpinned": "slideUp"
           }
         });
      }

      if($_header_menu.length){
         $_header_topoffset = $_header_menu.offset().top;
      }

      // Change scrollbar height when load
      change_height();

      // 13. Fixed Sidebar Scrollbar
      $_stickyScrollbar.each(function(){
        $(this).perfectScrollbar({
           wheelSpeed: 1,
           suppressScrollX: true
        });
      });

      // Change scrollbar height when resize
      $(window).on("resize", function() {
         change_height();
      });

      var dt_index, dt_len, $_var, $_cont, $_selector, dt_args, $_inf_cont;
      for (dt_index = 0, dt_len = dt_paginated_blocks.length; dt_index < dt_len; ++dt_index) {
        $_var = dt_paginated_blocks[dt_index];
        $_cont = '#' + $_var;
        $_selector = '.block';
        $_selector = '.' + dt_paginated_blocks_items[dt_index];

        dt_args = {
          navSelector  : '#nav' + $_var,    // selector for the paged navigation
          nextSelector : '#nav' + $_var + ' a:last',  // selector for the NEXT link (to page 2)
          itemSelector : $_selector,
          bufferPx: 100,
          loading: {
            finished: function(){ $('.infscr-loading').each(function(){ $(this).hide(); }); },
            finishedMsg: "<em>Empty</em>",
            img: dt_path + '/img/loader.gif',
            msg: null,
            msgText: "",
            selector: null,
            speed: 'fast',
            start: undefined
          },
        };

        $_inf_cont = $( $_cont );

        if( dt_paginated_blocks_type[dt_index] != undefined && dt_paginated_blocks_type[dt_index] == 'load-more' ){
          dt_args['behavior'] = "twitter";
        }

        $_inf_cont.infinitescroll( dt_args );

        jQuery(document).ajaxError(function (e, xhr, opt) { if (xhr.status == 404) $('#nav' + $_var).remove(); });
      }

      change_header(0);
      $(window).scroll(function(){
         var $_scrolltop = $(this).scrollTop();
         // Go to top button
         if ( $_scrolltop > 100) {
            $_goTop.css({ bottom: '20px' });
         }
         else {
            $_goTop.css({ bottom: '-100px' });
         }

         change_header($_scrolltop);
      });

      function change_header( scrolltop ){
        // Fixed header
        if ( scrolltop >= $_header_topoffset) {
          $_header_menu.addClass("set-fixed");
          $_sidebar.addClass("set-sidebar");
          $_sidebar.css('top', 50);
          change_height();
        }
        else {
          $_header_menu.removeClass("set-fixed");
          $_sidebar.removeClass("set-sidebar");
          var $_top_marg = $_header_topoffset + 50 - scrolltop;
          $_sidebar.css('top', $_top_marg);
          change_height();
        }
      }

      // Change scrollbar height
      function change_height(){
         var windowHeight = $(window).height();

         if( $_sidebar.length ){
            $_offset = $_sidebar.position().top + 80;

            var setHeight = windowHeight - $_offset;
            $_stickyScrollbar.each(function(){
              $(this).height(setHeight);
              $(this).perfectScrollbar('update');  // Update
            });
         }

         // Mobile menu scroll
         change_mobile_height();
      }

      $('.mm-next').on('click', function(){
        change_mobile_height();
      })

      function change_mobile_height(){
        var windowHeight = $(window).height();
        $_mob.height(windowHeight);
        $_mob.perfectScrollbar('update');  // Update
      }

      // 14. Go to Top Button
      $_goTop.on("click", function(){
         $('html, body').animate({scrollTop : 0},700);
         return false;
      });

    });

});
/*
 * End Jquery
*/

// 15. Count up share counter
function dt_countUp(){
  if(document.getElementById("countUp")){
     var count = document.getElementById("countUp");

     var number = 0;

     if(count.hasAttribute("data-count")){
        number = count.getAttribute("data-count");
        if( !isNumeric (number) ){
          number = 0;
        }
     }

     var options = {
       useEasing : true,
       useGrouping : true,
       separator : '',
       decimal : '.',
       prefix : '',
       suffix : ''
     };

     var counter = new countUp("countUp", 0, number, 0, 2.5, options);

     var waypoint = new Waypoint({
       element: count,
       handler: function(direction) {
         counter.start();
       },
       offset: window.innerHeight-110
     });
  }
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// 16. Header Search Button
if(document.getElementById("sb-search")){
   new UISearch( document.getElementById( "sb-search" ) );
}

// 17. Google Map
var map_canvas =  document.getElementById('map-canvas');
if (typeof(map_canvas) != 'undefined' && map_canvas != null)
{
   // Contact page Google map
   function initialize() {
     var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
     var mapOptions = {
       zoom: 4,
       center: myLatlng
     }
     var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

     var marker = new google.maps.Marker({
         position: myLatlng,
         map: map,
         title: 'Hello World!'
     });
   }

   google.maps.event.addDomListener(window, 'load', initialize);
}

// Share buttons
function dt_share(type, title, descr) {
  var winWidth  = 575,
    winHeight = 420,
    url = window.location.href;

  var winTop = (screen.height / 2) - (winHeight / 2);
  var winLeft = (screen.width / 2) - (winWidth / 2);
  var link = "";

  switch(type){
    case "fb":
        link = dt_get_fburl(title, descr, url);
        break;
    case "tw":
        link = dt_get_twurl(title, url);
        break;

    case "gp":
        link = dt_get_gpurl(url);
        break;

    case "ln":
        link = dt_get_lnurl(title, url);
        break;
  }
  window.open(link, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width='+winWidth+',height='+winHeight);
}

function dt_get_fburl(title, descr, url){
  return 'http://www.facebook.com/share.php?u=' +encodeURIComponent(url)+ '&title=' + encodeURIComponent(title);
}

function dt_get_twurl(title, url){
  return 'http://twitter.com/home?status=' + encodeURIComponent(title) + '+' + encodeURIComponent(url);
}

function dt_get_gpurl(url){
  return 'https://plus.google.com/share?url=' + encodeURIComponent(url);
}

function dt_get_lnurl(title, url){
  return 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
}
