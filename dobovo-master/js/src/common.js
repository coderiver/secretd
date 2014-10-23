
$(document).ready(function() {



  //   var container = document.querySelector('.masonry');
  //   var close_item = document.querySelector('.sticker .btn-del');
  //   var msnry = new Masonry( container, {
  //       columnWidth: 300,
  //       itemSelector: '.item'
  //   });

  //   eventie.bind( container, 'click', function( event ) {
  //   // don't proceed if item was not clicked on
  //   if ( !classie.has( event.target, 'item' ) ) {
  //     return;
  //   }
  //   // remove clicked element
  //   msnry.remove( event.target );
  //   // layout remaining item elements
  //   msnry.layout();
  // });

    $(document).click(function() {
        $(".js-datepicker").hide();
        $(".js-show-calendar").removeClass('is-active');
        $(".js-choose").parent().removeClass("is-active");
        $(".js-choose-list").hide();
        $('.js-select-list').hide();
        $(".js-select").parent().removeClass("is-active");
        $(".js-drop-key").parent().removeClass("is-active");
        $(".js-drop-list").hide();
        $(".js-tab-key").removeClass("is-active");
        $(".js-sel-key").removeClass("is-active");
        $('.js-tab-cont').hide();
        $('.js-faq-sticker').removeClass("is-visible");
    });

// universal select list
    function select() {
        $(".js-select").each(function(){
            var select_list = $(this).parent().find(".js-select-list");
            $(this).click(function(){
                if ($(this).parent().hasClass("is-active")) {
                    $(this).parent().removeClass("is-active");
                    select_list.hide();
                }
                else {
                    //$(".js-select").parent().removeClass("is-active");
                    $(this).parent().addClass("is-active");
                    //$(".js-select-list").hide();
                    select_list.show();
                }
            });

            select_list.find("li").click(function() {
                var id = $(this).attr("data-id");
                var text = $(this).text();
                $(this).parent().parent().find(".js-select").text(text);
                $(this).parent().parent().find("input").val(id);
                $(this).parent().hide();
                $(this).parent().parent().removeClass("is-active");
            });
        });
    }
    select();
    $('.js-select-list').click(function(event){
        event.stopPropagation();
    });
    $('.js-select').click(function(event){
        event.stopPropagation();
    });

    $(".js-sel-key").click(function(event){
        if ($(this).hasClass("is-active")) {
            $(this).removeClass("is-active");
        }
        else {
            $(".js-sel-key").removeClass("is-active");
            $(this).addClass("is-active");
        }
        $('.js-show-calendar').removeClass("is-active");
        $(".js-datepicker").hide();
        event.stopPropagation();
    });

    $(".js-sel-list li").click(function(event) {
        var id = $(this).attr("data-id");
        var text = $(this).text();
        $(this).parent().parent().find(".js-sel-text").val(text);
        $(this).parent().parent().find(".js-sel-input").val(id);
        //$(this).parent().hide();
        $(this).parent().parent().removeClass("is-active");
        // Show calendar after city selected
        if ($(this).parent().parent().hasClass('select_city')) {
            $(".js-datepicker-from").show();
            var maxpersons = ($(this).attr("data-maxpersons") >10) ? 10 : parseInt($(this).attr("data-maxpersons"));
            $('#dbv_select_guests ul li').each(function() {
                if(parseInt($(this).attr('data-id'))>maxpersons) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
            // reset Guests value if it is larger than maxpersons
            if (maxpersons < $('#dbv_select_guests .js-sel-input').val()) {
                $('#dbv_select_guests .js-sel-text').val('');
                $('#dbv_select_guests .js-sel-input').val(1);
            }
        }
        event.stopPropagation();
    });
    // $('.js-sel-text').click(function(event){
    //     event.stopPropagation();
    // });

    $(".js-all-city").click(function(){
        $(".js-city-list").toggle();
        $('html, body').animate({
            scrollTop: $(".js-city-list").offset().top
        }, 500);
        return false;
    });
    $(".js-to-comments").click(function(){
        $('html, body').animate({
            scrollTop: $(".js-comment-target").offset().top
        }, 500);
        return false;
    });
    $(".js-to-top").click(function(){
        $('html, body').animate({
         scrollTop: 0
        }, 200);
    });

// ------ jquery datepicker ui
    if ($(".js-datepicker").length > 0) {
        $(".js-datepicker").each(function(){
            $(this).hide();
            $.datepicker.regional['all'] = {
                weekHeader: 'Не',
                dateFormat: 'yy-mm-dd',
                firstDay: 1,
                isRTL: false,
                minDate: '0',
                showMonthAfterYear: false,
                yearSuffix: ''};
            $.datepicker.setDefaults($.datepicker.regional[dbv_get_current_lang()]);
            $.datepicker.setDefaults($.datepicker.regional['all']);
            //$.datepicker.setDefaults(regional['en']);

            $(".js-datepicker-from").datepicker({
              showOtherMonths: true,
              onSelect: function( selectedDate ) {
                $(".js-show-calendar").removeClass("is-active");
                $(".js-datepicker").hide();
                var dateObject=new Date($(".js-datepicker-from").datepicker('getDate'));
                $(".js-from").val($.datepicker.formatDate('d MM', dateObject));
                $(".js-from").css('padding-left', '10px');
                $(".js-from").parent().parent().find('.select__input-text').hide();
                dateObject.setDate(dateObject.getDate()+1);
                $(".js-to").val($.datepicker.formatDate('d MM', dateObject));
                $(".js-to").css('padding-left', '10px');
                $(".js-datepicker-to").datepicker( "option", "minDate", dateObject );
                $(".js-datepicker-to").datepicker('setDate', dateObject);

                check_date();
                $(".js-datepicker-to").show();
              }
            });
            $(".js-datepicker-to").datepicker({
              showOtherMonths: true,
              onSelect: function( selectedDate ) {
                $(".js-show-calendar").removeClass("is-active");
                $(".js-datepicker").hide();
                var dateObject=new Date($(".js-datepicker-to").datepicker('getDate'));
                $(".js-to").val($.datepicker.formatDate('d MM', dateObject));
                $(".js-to").css('padding-left', '10px');
                $(".js-to").parent().find('.select__input-text').hide();
                dateObject.setDate(dateObject.getDate()-1);
                $(".js-datepicker-from").datepicker( "option", "maxDate", dateObject );
                check_date();
                $(".js-sel-key").removeClass("is-active");
                //$('#dbv_select_guests').addClass("is-active");
                // Blink search button after dates selected
                $( "#dbv_search_btn" ).fadeTo(100, 0.5, function() {
                    $('#dbv_search_btn').fadeTo(100, 1);
                    $( "#dbv_search_btn" ).fadeTo(100, 0.5, function() {
                        $('#dbv_search_btn').fadeTo(100, 1);
                    });
                });

              }
            });
        });

        $(".js-show-calendar").click(function(){
            if ($(this).hasClass("is-active")) {
                $(this).removeClass("is-active");
                $(".js-datepicker").hide();
            }
            else {
                $(".js-show-calendar").removeClass("is-active");
                $(this).addClass("is-active");
                $(".js-datepicker").hide();
                $(this).find(".js-datepicker").show();
            }
        });
        $('.js-datepicker').click(function(event){
            event.stopPropagation();
        });
        $('.js-show-calendar').click(function(event){
            $(".js-sel-key").removeClass("is-active");
            event.stopPropagation();
        });
    }

    function check_date() {
        $(".js-flat-pricer").each(function(i) {
            var input_from = $(this).find(".js-from").val().length;
            var input_to = $(this).find(".js-to").val().length;
            if ( input_from > 0 && input_to > 0) {
                //$(this).find(".js-order-btn").show();
                //$(this).find(".js-choose-date-btn").hide();
                $(".js-order-btn").show();
                $(".js-choose-date-btn").hide();
            }
            $(this).find(".js-choose-date-btn").bind("click", function(){
                $(this).parent().find(".js-first-date").addClass("is-active");
                $(this).parent().find(".js-first-date .js-datepicker").show();
                event.stopPropagation();
            });
        });
    }
    check_date();

// ------ location
    $('.js-top-popup').click(function() {
        $('.js-top-popup').removeClass('is-active');
        $(this).toggleClass('is-active');
    });

// ---- choose number
    function choose_number() {
            var number = $(".js-choose-number");
            number.each(function(){
                var max_number = +($(this).parent().parent().attr("data-max-number"));
                var plus = $(this).parent().parent().find(".js-plus");
                var minus = $(this).parent().parent().find(".js-minus");
                plus.bind("click", function(){
                    var val = +($(this).parent().find(number).text());
                    if (val >= max_number) {
                        return false
                    }
                    else {
                        val += 1;
                        $(this).parent().find(".choose__input").val(val);
                        $(this).parent().find(number).text(val);
                    }
                });
                minus.bind("click", function(){
                    var val = +($(this).parent().find(number).text());
                    if (val > 1) {
                        val -= 1;
                        $(this).parent().find(".choose__input").val(val);
                        $(this).parent().find(number).text(val);
                    }
                    else {
                        return false;
                    }
                });
            });


        $(".js-choose-key").bind("click", function(){
            $(this).parent().toggleClass("is-active");
            $(this).parent().find(".js-choose-list").toggle();
        });
        $('.js-choose-list').click(function(event){
            event.stopPropagation();
        });
        $('.js-choose').click(function(event){
            event.stopPropagation();
        });
        $(".js-choose").each(function(){
            var choose_list = $(this).parent().find(".js-choose-list");
            $(this).click(function(){
                if ($(this).parent().hasClass("is-active")) {
                    $(this).parent().removeClass("is-active");
                    choose_list.hide();
                }
                else {
                    $(".js-choose").parent().removeClass("is-active");
                    $(this).parent().addClass("is-active");
                    $(".js-choose-list").hide();
                    choose_list.show();
                }
            });

            choose_list.find("li").click(function(){
                var id = $(this).attr("data-id");
                var text = $(this).text();
                $(this).parent().parent().find(".js-choose-number").text(text);
                $(this).parent().parent().find("input").val(id);
                $(this).parent().hide();
                $(this).parent().parent().removeClass("is-active");
            });
        });
    }
    choose_number();

    $(".js-extend-link").click(function(){
        $(this).parent().find(".js-extend").toggleClass("is-active");
    });


    function drop_list() {
        $(".js-drop-key").bind("click",function(event){
            var drop_id = $(this).attr("data-drop-id");
            $(this).parent().toggleClass("is-active");
            $("."+drop_id).toggle();
            event.stopPropagation();
        });

        $('.js-drop-list').click(function(event){
            event.stopPropagation();
        });

        var more = $(".js-drop-more");
        var hide = $(".js-drop-hide");
        more.bind("click",function() {
            $(this).parent().parent().addClass("is-extend");
        });
        hide.bind("click",function() {
            $(this).parent().parent().removeClass("is-extend");
        });
    }
    drop_list();


    function init_cycle() {
        if ($(".js-slider").length > 0) {

            $(".js-slider").each(function(){
                var slider_1 = $(this).find('.js-cycle-1');
                var slider_2 = $(this).find('.js-cycle-2');
                var prev_nav = $(this).find('.js-cycle-prev');
                var next_nav = $(this).find('.js-cycle-next');
                slider_2.cycle({
                    prev: prev_nav,
                    next: next_nav
                });
                slider_1.cycle();

                var slideshows = $(this).find('.js-cycle').on('cycle-next cycle-prev', function(e, opts) {
                    // advance the other slideshow
                    slideshows.not(this).cycle('goto', opts.currSlide);
                });

                slider_2.find(".cycle-slide").click(function(){
                    var index = slider_2.data('cycle.API').getSlideIndex(this);
                    slideshows.cycle('goto', index);
                });
            });
        }
    }
    init_cycle();

    $(".js-close").bind("click", function(){
        $(this).parent().hide();
        $(".js-overlay").hide();
    });
    $('.js-popup').click(function(event){
        event.stopPropagation();
    });
    $(".js-overlay").bind("click", function(){
        $(this).hide();
        $('.js-popup').hide();
    });


    function tab() {
        $(".js-tab-key").bind("click",function(event){
            if ($(this).hasClass("is-active")) {
                $(this).removeClass("is-active");
                $(".js-tab-cont").hide();
            }
            else {
                $(".js-tab-key").removeClass("is-active");
                $(".js-tab-cont").hide();
                $(this).addClass("is-active");
                var id = $(this).attr("data-tab");
                $("."+id).show();
            }
            event.stopPropagation();

        });
        $('.js-tab-cont').click(function(event){
            event.stopPropagation();
        });
    }
    tab();

    var tooltip = $(".js-tooltip");
    tooltip.hover(
        function(){
            $(this).show();
        },
        function() {
            $(this).hide()
        }
    );
    $(".js-with-tooltip").hover(
        function(){
            var left = $(this).offset().left;
            var top = $(this).offset().top + $(this).outerHeight();
            var html = $(this).attr("data-info");
            tooltip.children().html(html);
            tooltip.css({
                left: left,
                top: top
            });
            if ($(this).parent().parent().hasClass("owner__list")) {
                tooltip.css({
                    left: left-22,
                    top: top
                });
            }

            //console.log(position);
            tooltip.fadeIn("fast");
        },
        function() {
            tooltip.hide()
        }
    );

    $(".js-to-map-popup").click(function(){
        $(".js-popup-map").show();
        $(".js-overlay").show();
        return false;
    });

    $(".js-del").click(function(){
        $(this).parent().remove();
    });

    $(".js-marked-link").hide();
    $(".js-btn-mark").bind("click",function(){
        $(this).toggleClass("is-active");
        if ($(this).parents(".catalog-wrap").find(".js-btn-mark.is-active").length > 0 || $(this).parents(".map").find(".js-btn-mark.is-active").length > 0 || $(this).parents(".flat-pricer").find(".js-btn-mark.is-active").length > 0) {
            $(".js-marked-link").show();
        }
        else {
             $(".js-marked-link").hide();
        }
        return false;
    });


    // show fixed flat info
    function fixed_flat_info() {
        if ($(".js-targe-info").length) {
        var top = $(".js-targe-info").offset().top;
        }
        if ($(window).scrollTop() > top) {
            $(".flat-info-fixed").fadeIn("fast");
        }
        else {
            $(".flat-info-fixed").fadeOut("fast");
        }
    }
    if ($(".flat-info-fixed").length > 0) {
        fixed_flat_info();
    }

    $(window).scroll(function(){
        if ($(".flat-info-fixed").length > 0) {
            fixed_flat_info();
        }
    });

    $(".js-open-faq").click(function(event){
        $(".js-faq-sticker").toggleClass("is-visible");
        event.stopPropagation();
        return false;
    });
    $(".js-faq-sticker").click(function(event){
        event.stopPropagation();
    });
    $(".js-close-sticker").click(function(){
        $(this).parent().toggleClass("is-visible");
    });

});
