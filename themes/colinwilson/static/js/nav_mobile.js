(function () {
	var mobilenav = document.querySelector("#mobilenav");

	var headroom = new Headroom(mobilenav, {
		offset: 10,
		tolerance: {
			down: 5,
			up: 5
		},
		classes: {
			initial: "animated",
			pinned: "slideUp",
			unpinned: "slideDown"
		}
	});
	headroom.init();
})();
