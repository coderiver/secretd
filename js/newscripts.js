$(document).ready(function() {

	$.fn.extend({
	  toggleText: function (a, b){
	    if (this.text() == a){ this.text(b); }
	    else { this.text(a) }
	  }}
	);

	$('.compare__span').click(function() {
		$(this).toggleText("К сравнению", "В сравнении");
	});

});