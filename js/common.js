head.ready(function() {

	var wrap = $('.sblock__wrap'),
		toShow = $('.sblock__hidden');

	wrap.find('.hide').click(function(event) {
		$(this).closest('.sblock').find(toShow).addClass('is-active');
		$(this).closest(wrap).hide();
	});

	toShow.find('.hide').click(function(event) {
		$(this).parent().removeClass('is-active').next().show();
	});

});