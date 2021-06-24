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
		offset: 10,
		tolerance: {
			down: 10,
			up: 10
		},
		classes: {
			initial: "animated",
			pinned: "slideUp",
			unpinned: "slideDown"
		}
	});
	headroom.init();
})();
