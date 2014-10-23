$(document).ready(function() {
    // set currencies
    dbv_load_currency_rates();
    // display text in SEO block
    display_seo_text();
    // lang proposal
    lang_propose();
    // Load LiveChat (probably should be last)
    dbv_livechat_init();
    // Load apt cal
    dbv_get_calendar('current');
});

// Display text in SEO block
function display_seo_text() {
    if ($('#dbv_seo_text').length && $('#dbv_seo_block').length) {
        $('#dbv_seo_block').html($('#dbv_seo_text').html()).show();
    }
}
// Propose a language for new users
function lang_propose() {
    // exit if this is not first visit
    if ($.cookie('DOBOVO_OLDUSER')) {
        return;
    }
    // set DOBOVO_OLDUSER cookie
    $.cookie('DOBOVO_OLDUSER', 1, {
        expires: 10, //days
        path: '/', 
    });

    // current site lang
    var siteLang = $('#dbv_lang_selector').parent().find('.currency__text').text().toUpperCase();
    // user browser language 
    var userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.substr(0,2).toUpperCase(); // in case of en_GB or so
    // Exit if Lang is set correctly already
    if (siteLang == userLang) { 
        return;
    }
    // get available langs
    var html;
    $('#dbv_lang_selector>li').each(function() {
        var lang_code = $('a', this).text();
        // Proceed to the next one if it's not what are we looking for
        if (lang_code != userLang) { 
            return;
        }
        var text = $(this).attr('title');
        var lang_name = text.split(' ').pop(); // last word
        text = text.replace(/\S+\s*$/,''); // delete last word (it'll be a URL)
        html = text + '<a href="' + $('a', this).attr('href') + '">' + lang_name + '</a>';
    });
    // if we have anything to propose
    if (html.length > 0) { 
        $('body').prepend('<div id=dbv_lang_propose></div>');
        $('#dbv_lang_propose').html('<button onClick="$(this).parent().hide()"></button>' + html).slideDown(1000);
    }
}

// Function to convert currencies for all prices on the page (class=dbv_price)
function dbv_change_currency(setCur) {
    // get currency from Cookie
    var currentCur = $.cookie('Currency') || 'uah';
    currentCur = currentCur.toUpperCase();
    
    // get target currency
    var newCur = (setCur) ? setCur : currentCur; 

    // changing currency 
    if(newCur != currentCur || !setCur) {
        // set currency to cookie
        $.cookie('Currency', newCur.toLowerCase(), {
            expires: 10, //days
            path: '/', 
        });
        // calculate new currency price for each class=dbv_price
        $('.dbv_price').each(function() {
            // backup original (UAH) price to feature convertation
            if (! $('.dbv_orig', this).length) { 
                $('.dbv_val', this).after('<span class=dbv_orig style="display: none">' +  $('.dbv_val', this).text() + '</span>');
            }
            $('.dbv_val', this).text(dbv_currency_convert('UAH', newCur, $('.dbv_orig', this).text()));
            $('.dbv_cur', this).text(newCur);
        });
        $('.dbv_price_round').each(function() {
            // backup original (UAH) price to feature convertation
            if (! $('.dbv_orig', this).length) { 
                $('.dbv_val', this).after('<span class=dbv_orig style="display: none">' +  $('.dbv_val', this).text() + '</span>');
            }
            $('.dbv_val', this).text(dbv_currency_convert('UAH', newCur, $('.dbv_orig', this).text(), 0));
            $('.dbv_cur', this).text(newCur);
        });

    }
    $('#current_currency').text(newCur);
}

// currency converter
function dbv_currency_convert(from, to, sum, round) {
    if (typeof round == 'undefined') { round = 2; } 
    var res = Math.round(sum*(window.dbv_CurrencyRates[from]/window.dbv_CurrencyRates[to]) * 100) / 100;
    return res.toFixed(round);
}
// Loading currency rates and calculate prices on the page
function dbv_load_currency_rates() {
    var $url = dbv_get_static_url() + '/currencyRates.js';
    $.getScript($url, function() { dbv_change_currency(); } );
}

// Getting static url from <script src=...>
function dbv_get_static_url() {
    var str = $('#dbv_main_js').attr('src').split('/');
    str.pop();
    return str.join('/');
} 

function dbv_loading_img() {
    return '<img style="padding: 28px" src="' + dbv_get_static_url() + '/../img/loading.gif">';
}

function dbv_loading_html() {
    return '<div style="text-align: center">' + dbv_loading_img() + '</div>'
}

function dbv_load_home_city(city_id) {
    // Get city to show
    var cur_id = city_id.shift();
    // Return if nothing to show
    if(! cur_id) { return; }
    
    $('.dbv_city_blk:last .dbv_next_btn .load-more').replaceWith(dbv_loading_img());
    // this should be in css later
    $('.dbv_city_blk:last .dbv_next_btn').css('text-align', 'center');

    $.get('/dobovo/home/city.php?cmd=home&show_next_btn=1&lang=' + dbv_get_current_lang() + '&city_id=' + cur_id, function(data) {
        // hide the button
        $('.dbv_city_blk:last .dbv_next_btn').hide();
        // insert new city after the last one
        $('.dbv_city_blk:last').after(data);
        // init masonry for new city (apt blocks placement)
        var $container = $('.dbv_city_blk:last>.js-masonry:first');
        $container.masonry($.parseJSON($container.attr('data-masonry-options')));
        // change currency for new blocks
        dbv_change_currency();
        // load next city
        dbv_load_home_city(city_id);
      });
}

function dbv_get_reviews(type, apt_id, order, page) {
    $('#dbv_' + type + '_review_blk').html(dbv_loading_html());
    $.get('/dobovo/apt/reviews.php?cmd=apt&type=' + type + '&lang=' + dbv_get_current_lang() + '&order=' + order + '&apt_id=' + apt_id, function(data) {
        $('#dbv_' + type + '_review_blk').html(data);
    });
}

function dbv_search_apt(field) {
    var search = $(field).val();
    if (search.length>0)
    {
        jQuery.getJSON("/tools/ajax.php", { search_apt: search },
            function(data)
            {
                if (!data.apt_id)
                {
                    if (data.hasOwnProperty('message')) {
                        show_ajax_error(data.message);
                    }
                    jQuery(field).val('');
                }
                else
                {
                    window.location.href = data.apt_id;
                }
            }
        );
    } else {
        jQuery(field).val('');
    }
}

function dbv_get_current_lang() {
    return $('#dbv_lang_selector').parent().find('.currency__text').text();
}

function dbv_search(btn) {
    var search_form = $( btn ).parent();
    var city_id = search_form.find('.select_city .js-sel-input').val();
    $.get('/tools/ajax.php?get_city_url=' + city_id, {}, function(data) { 
        if(data) {
            var date_from = ($('.js-from').val().length) ? $(".js-datepicker-from").datepicker({ dateFormat: 'yy-mm-dd' }).val() : null;
            var date_to = ($('.js-to').val().length) ? $(".js-datepicker-to").datepicker({ dateFormat: 'yy-mm-dd' }).val() : null;
            var guests = search_form.find('.select_guest .js-sel-input').val();
            var params = '';
            if (date_from && date_to) {
                params += 'in=' + date_from + '&out=' + date_to;
            }
            if (parseInt(guests) > 1) {
                if (params) { params += '&'; }
                params += 'persons=' + guests;
            }
            if (params.length) {
                params = '?' + params;
            }
            location.href=data + params;
        }
    });
}
// Var for last AJAX response from server
var dbv_aptCalendar;
// Calendar States (discounts, selected dates and so)
var dbv_aptCalendarVars = new Object;

function dbv_get_calendar(direction) {
    data = new Object;
    data.id = parseInt($('#dbv_apt_id').text());
    if (typeof dbv_aptCalendar === 'object') {
        if (direction == 'next') { 
            dbv_aptCalendar.first_day.setMonth(dbv_aptCalendar.first_day.getMonth()+1);
        } else {
            dbv_aptCalendar.first_day.setMonth(dbv_aptCalendar.first_day.getMonth()-1);
        }
        data.date = dbv_DateToSQLFormat(dbv_aptCalendar.first_day);
    }
    $('.dbv_calendar_popup').show();
    $.ajax({
        dataType: "json",
        url: '/dobovo/apt/ajax.php?action=getCalendar' + '&lang=' + dbv_get_current_lang(),
        data: data,
        method: 'POST',
        error: function(Rdata, Status) { 
            $('.dbv_calendar_popup').hide();
            show_ajax_error("We're sorry! Request has failed: " + Status);
            return;
        },
        success: function(Rdata) {
            $('.dbv_calendar_popup').hide();
            if (Rdata.hasOwnProperty('message')) {
                show_ajax_error(Rdata.message);
                $('.respond[item-id='+review_id+']').find('.respond__like>span').hide();
            }
            if (Rdata.success == true) {
                // save last AJAX respnse
                dbv_aptCalendar = Rdata;
                // update cal
                dbv_update_apt_calendar();
                return;
            }
        } 
    });
}

function dbv_update_apt_calendar() {
    // set calendar header titles
    $('#dbv_calendar_first_month').html(dbv_aptCalendar.first_month);
    $('#dbv_calendar_last_month').html(dbv_aptCalendar.last_month);
    // get first date from response
    for (var first_day in dbv_aptCalendar.calendar) break; //geting first date
    // first day of the first month in calendar
    dbv_aptCalendar.first_day = dbv_DateClassFromSQL(first_day);
    dbv_aptCalendar.first_day.setDate(1);
    var today = new Date();
    today.setHours(0,0,0,0);
    // if there is discount and it did not already set
    if (typeof dbv_aptCalendar.discounts !== 'undefined' && $('#dbv_calendar_discounts').html().length == 0) {
        var html = '';
        for( i in dbv_aptCalendar.discounts) {
            var val = dbv_aptCalendar.discounts[i];
            html += '<div data-value=' + val.discount + '><span>' + val.days + ' ' + val.text + '</span> -' + val.discount + '%</div>';
        }
        $('#dbv_calendar_discounts').html(html);
        // upadte calendar with new discounted prices
        $('#dbv_calendar_discounts>div').click(function() {
            if ($(this).hasClass('is-active')) {
                $('#dbv_calendar_discounts>div').removeClass('is-active');
                dbv_aptCalendarVars.discount = 0;
            } else {
                $('#dbv_calendar_discounts>div').removeClass('is-active');
                $(this).addClass('is-active'); 
                dbv_aptCalendarVars.discount = $(this).attr('data-value');
            }
            dbv_update_apt_calendar();
        });
    }

    // calendar for 2 monthes
    for (var i = 0; i < 2; i++) {
        // first day of first month
        var start = dbv_DateClassFromSQL(first_day);
        start = new Date(start.getFullYear(), start.getMonth()+i, 1);
        
        // Empty cells before 1st day of month
        var used_cells = start.getDay() - 1;
        if (used_cells < 0) { used_cells = 6; } // Sunday
        var html = '';
        for (var k = 0; k < used_cells; k++) html += '<div class="cell is-other-month"></div>';

        // First day of start+1 month
        var end = new Date(start);
        end.setMonth(end.getMonth()+1);

        var day = new Date(start);
        while (day < end) {
            var cell_class = 'is-last-days';
            var cur_date = dbv_DateToSQLFormat(day);
            var date_html = new Array();
            date_html.push('<a href="#">');
            date_html.push('<span>' + day.getDate() + '</span>');
            if(dbv_aptCalendar.calendar[cur_date]) {
                cell_class = (dbv_aptCalendar.calendar[cur_date].state<1) ? 'is-inactive' : '';
                // calculating prices
                var price = (typeof dbv_aptCalendarVars.discount === 'undefined') 
                                ? dbv_aptCalendar.calendar[cur_date].price 
                                : dbv_aptCalendar.calendar[cur_date].price * (100 - dbv_aptCalendarVars.discount) / 100;
                date_html.push('<i class="dbv_price_round"><span class=dbv_cur>UAH</span><span class=dbv_val>' + price + '</span></i>'); 
            }
            date_html.push('</a>');
            if (dbv_DateToSQLFormat(day) == dbv_DateToSQLFormat(today)) {
                cell_class += ' is-today';
            }
            if (day < today) {
                cell_class = 'is-last-days';
            }
            html += '<div class="cell ' + cell_class + '">' + date_html.join('') + '</div>';
            //html += '<div class="' + cell_class + '"><a href="#"><span>' + day.getDate() + '</span><i class="dbv_price"><span class=dbv_val>' + dbv_aptCalendar.calendar[cur_date].price + '</span><span class=dbv_cur>RUB</span></i></a></div>';
            day.setTime(day.getTime() + (24 * 60 * 60 * 1000));
            used_cells++;
        }
        // Empty cells after last day of month
        for (var k = used_cells; k < 42; k++) html += '<div class="cell is-other-month"></div>';
        // Applying html
        $('#dbv_calendar_month' + i).html(html);
    };
    // change currency for new blocks
    dbv_change_currency();

}

function dbv_DateToSQLFormat(date) {
    return ('000' + date.getFullYear()).slice(-4) + '-' + ('0' + (1+date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}
function dbv_DateClassFromSQL(date) {
    date = date.split('-');
    return new Date(date[0], date[1]-1, date[2]);
}

function dbv_review_like(review_id) {
    data = new Object;
    data.id = review_id;
    $.ajax({
        dataType: "json",
        url: '/dobovo/apt/ajax.php?action=reviewLike',
        data: data,
        method: 'POST',
        error: function(Rdata, Status) { 
            show_ajax_error("We're sorry! Request has failed: " + Status);
            return;
        },
        success: function(Rdata, Status) {
            if (Rdata.message) {
                show_ajax_error(Rdata.message);
                $('.respond[item-id='+review_id+']').find('.respond__like>span').hide();
            }
            if (Rdata.success == true) {
                likes_el = $('.respond[item-id='+review_id+']').find('.respond__like>i');
                likes_el.html(parseInt(likes_el.text()) + 1);
                $('.respond[item-id='+review_id+']').find('.respond__like>span').hide();
            }
        } 
    });
}

function show_ajax_error(text) {
    var el_id = 'JSmessage_' + parseInt(Math.random()*1000000);
    $('body').prepend('<div class=dbv_JS_message id=' + el_id + '></div>');
    $('#' + el_id).html('<button onClick="$(this).parent().hide()"></button>' + text).slideDown(500).delay(2000).fadeOut(500, function() { $(this).remove() });
}
// LiveChat Code
var __lc = {};
var __lc_buttons = [];
__lc.license = 1039501;
__lc.dbv_chatID = 'LiveChat_1390310997';

function dbv_livechat_init() {
    __lc_buttons.push({
        elementId: __lc.dbv_chatID,
        skill: '0',
        window: {
            width: 500,
            height: 520
        },
        type: 'text',
        labels: {
            online: $('#' + __lc.dbv_chatID).attr('data-online'),
            offline: $('#' + __lc.dbv_chatID).attr('data-online')
        }
    });

    var src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
    $.getScript(src);
}
// End of LiveChat Code
