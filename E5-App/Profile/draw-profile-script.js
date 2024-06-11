import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://uwgcchivhnirzjamygqv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Z2NjaGl2aG5pcnpqYW15Z3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MjAyOTUsImV4cCI6MjAyMzk5NjI5NX0.Mte3RWleAt6UEADkwkOFJznwRZfsymx0Xbg748BZnZc"
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener("DOMContentLoaded", async function () {

	// Save profile
	const saveBtn = document.getElementById("save");
    
    saveBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const usernameData = document.getElementById("username").value;
        const emailData = document.getElementById("email").value;
        const ppData = document.getElementById("ppInput").files[0];

		function getBase64(file) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
			  document.getElementById("newPp").value = reader.result;
			};
			reader.onerror = function (error) {
			  console.log('Error: ', error);
			};
		 }

		 if (ppData != null) {
			getBase64(ppData);

			setTimeout(async function() { 
				var ppBLob = document.getElementById("newPp").value; 

				const { error } = await supabase
				.from('users')
				.update({ username: usernameData, email: emailData, pp: ppBLob })
				.eq('id', localStorage.getItem("userId"));

				if (error) {
					console.error("Couldn't insert in users");
				}
			
				location.reload();
			}, 1000);
		 }
		 else {
			const { error } = await supabase
				.from('users')
				.update({ username: usernameData, email: emailData })
				.eq('id', localStorage.getItem("userId"));

			if (error) {
				console.error("Couldn't insert in users");
			}
		 }
    });

	// Load galery
	const { data, error } = await supabase
		.from('users_drawing')
		.select('drawing (title, descr, image_data, is_public), users(id, username, email, pp)')

	for (var i =0; i < data.length; i++) {
		if (data[i].users.id == localStorage.getItem("userId")) {
			document.getElementById("pp").src = data[i].users.pp;
			document.getElementById("username").value = data[i].users.username;
			document.getElementById("email").value = data[i].users.email;
		}
	}
  
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
			self.getData(function(){
				var $container = self.options.$container;
				var html = self.generateHtml(self.options.$template, self.items);
				$container.append(html);
				self.startMasonry($container);
				self.loadImageMasonry($container);
			});
		},
		
		getData: function(callback) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].users.id == localStorage.getItem("userId")) {
					this.items.push({
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
			columnWidth: this.options.itemWidth +  this.options.gutter,
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
});