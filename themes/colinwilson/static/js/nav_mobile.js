(function () {
	const mobilenav = document.querySelector("#mobilenav");
	const mainnav = document.querySelector("#mainnav");

	const headroom_bottom = new Headroom(mobilenav, {
		offset: 10,
		tolerance: {
			down: 5,
			up: 5
		},
		classes: {
			initial: "animated",
			pinned: "slideUpBottom",
			unpinned: "slideDownBottom"
		}
	});

	const headroom_top = new Headroom(mainnav, {
		offset: 10,
		tolerance: {
			down: 5,
			up: 5
		},
		classes: {
			initial: "animated",
			pinned: "slideDownTop",
			notTop: "one-edge-shadow",
			unpinned: "slideUpTop"
		}
	});

	headroom_bottom.init();
	headroom_top.init();
})();
