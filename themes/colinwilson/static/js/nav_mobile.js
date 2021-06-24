// (function () {
// 	var nav = new Headroom(document.querySelector("#mobilenav"), {
// 		tolerance: 5,
// 		offset: 205,
// 		classes: {
// 			initial: "animated",
// 			pinned: "slideUp",
// 			unpinned: "slideDown"
// 		}
// 	});
// 	nav.init();
// }());


(function () {
	var mobilenav = document.querySelector("#mobilenav");

	var headroom = new Headroom(mobilenav, {
		tolerance: {
			down: 10,
			up: 20
		},
		offset: 15
	});
	headroom.init();
})();
