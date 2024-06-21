import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://uwgcchivhnirzjamygqv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Z2NjaGl2aG5pcnpqYW15Z3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MjAyOTUsImV4cCI6MjAyMzk5NjI5NX0.Mte3RWleAt6UEADkwkOFJznwRZfsymx0Xbg748BZnZc"
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener("DOMContentLoaded", async function () {

	const { data } = await supabase
		.from('users_drawing')
		.select('drawing(id, title, descr, image_data, is_public), users(id, username, pp)')

	for (var i =0; i < data.length; i++) {
		if (data[i].users.id == localStorage.getItem("userId")) {
			document.getElementById("pp").src = data[i].users.pp;
		}
	}
	
	createTable(data);
  
	// Comments

	const sendBtn = document.getElementById("send");
	const commentZone = document.getElementById("comment-zone");
	const drawingId = document.getElementById("drawingId");
	
	sendBtn.addEventListener("click", async function(event) {
		event.preventDefault();

		const comment = document.getElementById("comment").value;

		const { data, error } = await supabase
			.from('comments')
			.insert({ id_drawing: drawingId.value, by: localStorage.getItem("userId"), content: comment })

		if (error) {
			console.error("Couldn't add a comment");
		}
	});

	drawingId.addEventListener("change", async function(event) {
		event.preventDefault();
		
		const { data } = await supabase
			.from('comments')
			.select('*, users(pp)')
			.eq('id_drawing', parseInt(drawingId.value))

		for (var i = 0; i < data.length; i++) {
			if (!document.getElementById(data[i].id)) { 
				commentZone.innerHTML += "<div class='comment' id='" + data[i].id + "'><img class='pp-comment' src=" + data[i].users.pp + " />" + data[i].content + "</div>";
			}
		}		
	});


	// Search

	const searchbtn = document.getElementById("search-btn");

	searchbtn.addEventListener("click", async function(event) {
		event.preventDefault();

		const searchinfo = document.getElementById("drawing-search").value;

		const { data } = await supabase
			.from('users_drawing')
			.select('drawing(id, title, descr, image_data, is_public), users(id, username, pp)')
			.like('drawing.title', '%' + searchinfo + '%')
			.not("drawing", "is", null)

		createTable(data);
	});
});


function createTable(data) {

	document.getElementById('container').innerHTML = "";

	var demo = {
	
		defaultOptions: {
			$container: $('.container-masonry'),
			$template: $('#item-template'),
			gutter: 20,
			imgWidth: 236,
			itemSelector: '.item',
			count: data.length,
		},
	
		options: {},
	
		items: [],
	
		init: function(options) {
			var self = this;
			self.options = $.extend({}, self.defaultOptions, options);
			self.getData(function() {
				var $container = self.options.$container;
				var html = self.generateHtml(self.options.$template, self.items);
				$container.append(html);
				self.startMasonry($container);
				self.loadImageMasonry($container);
			});
		},
		
		getData: function(callback) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].drawing.is_public) {
					this.items.push({
						id: data[i].drawing.id,
						image: data[i].drawing.image_data,
						title: data[i].drawing.title,
						likeCount: this.getRandomIntInclusive(1, 999),
						avatar: data[i].users.pp,
						name: data[i].users.username,
						tagline: data[i].drawing.descr,
					});
				}
			}
			if (callback) callback();
		},
		
		generateHtml: function($selector, items) {
			var source   = $selector.html();
			var template = Handlebars.compile(source);
			return template({items: items});
		},
		
		startMasonry: function($container) {
			$container.masonry({
				itemSelector: this.options.itemSelector,
				columnWidth: this.options.imgWidth + this.options.gutter,
				fitWidth: true,
			});
		},
		
		loadImageMasonry: function($container) {
				$container.imagesLoaded().progress(function() {
				$container.masonry('layout');
			});
		},
		
		getRandomIntInclusive: function (min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
	};
	demo.init();

	console.log(demo);
}