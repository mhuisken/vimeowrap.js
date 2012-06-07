/** @license
 * Vimeo Wrap
 *
 * Author: Wesley Luyten
 * Version: 1.1 - (2012/06/07)
 */

var vimeowrap = function(identifier) {
	return vimeowrap.api.select(identifier);
};

(function(vimeo) {
	var _players = {};

	vimeo.api = function(container) {
		var _this = this;
		var _playlist = null;
		
		this.container = container;
		this.id = container.id;
		
		this.display = null;
		this.player = null;
		this.config = null;
		this.plugins = {};
		
		this.froogaloop = null;

		this.setup = function(options) {
		
			var defaultConfig = {
				width: 480,
				height: 280,
				color: "00adef",
				repeat: "none",
				item: 0,
				api: true,
				player_id: vimeo.utils.uniqueId('player_')
			};
			this.config = vimeo.utils.extend(defaultConfig, options);
			_reset();
			
			var height = this.config.height;
			var displayTop = 0;
			for (var key in this.config.plugins) {
				if (typeof vimeo[key] === "function") {
					this.plugins[key] = new vimeo[key](this, this.config.plugins[key]);
					
					this.plugins[key].config['y'] = height;
					height += this.plugins[key].config['height'];
					if (this.plugins[key].config['position'] === "top") {
						this.plugins[key].config['y'] = displayTop;
						displayTop += this.plugins[key].config['height'];
					}

					this.plugins[key].setup();
				}
			}
			
			vimeo.utils.css(_this.container, {
				width: _this.config.width,
				height: height
			});

			vimeo.utils.css(_this.display, {
				top: displayTop
			});
			
			this.events.playlist.add(_playlistLoaded);
			var loader = new vimeo.playlistloader(this);
			loader.load(this.config.urls);
		};

		function _playlistLoaded(playlist) {
			_playlist = playlist;
			_embed(playlist[_this.config.item].url);
		}
		
		function _reset() {
			_this.container.innerHTML = "";
			vimeo.utils.css(_this.container, {
				position: 'relative'
			});
			
			_this.display = document.createElement('div');
			_this.display.id = _this.id + "_display";
			_this.container.appendChild(_this.display);
			vimeo.utils.css(_this.display, {
				width: _this.config.width,
				height: _this.config.height,
				position: 'absolute',
				background: '#000000'
			});
		}
		
		function _embed(url) {

			vimeo.utils.jsonp('http://vimeo.com/api/oembed.json', _getEmbedArgs({ url:url }), function(json) {

				var temp = document.createElement('div');
				temp.innerHTML = json.html;
				_this.player = temp.children[0];
				_this.player.id = _this.config.player_id;
				vimeo.utils.css(_this.player, {
					position: 'absolute',
					display: 'none'
				});

				var showPlayer = function() {
					vimeo.utils.css(_this.player, {
						display: 'block'
					});
				};
				if (_this.player.attachEvent) {
					_this.player.attachEvent("onload", showPlayer);
				} else {
					_this.player.onload = showPlayer;
				}
				
				vimeo.utils.prepend(_this.player, _this.display);
						
				vimeo.Froogaloop(_this.player.id).addEvent('ready', function() {

					_this.froogaloop = vimeo.Froogaloop(_this.player.id);
					_this.events.froogaloopReady.dispatch(_this.froogaloop);

					_this.froogaloop.addEvent('finish', _playerFinish);
				});
			});
		}
		
		function _getEmbedArgs(args) {
		
			var allowed = [	'url', 'width', 'maxwidth', 'height', 'maxheight', 'byline',
							'title', 'portrait', 'color', 'callback', 'autoplay', 'loop',
							'xhtml', 'api', 'wmode', 'iframe', 'player_id'];

			for (var i = 0; i < allowed.length; i++) {
				var key = allowed[i];
				if (_this.config.hasOwnProperty(key)) args[key] = _this.config[key];
			}
			
			return args;
		}

		function _playerFinish(data) {
			var index;
			switch (_this.config.repeat) {
				case "list":
					index = _this.config.item + 1;
					if (index < _playlist.length) {
						_this.playlistItem(index, true);
					}
					break;
				case "always":
					index = _this.config.item + 1;
					if (index >= _playlist.length) {
						index = 0;
					}
					_this.playlistItem(index, true);
					break;
			}
		}
		
		this.playlistItem = function(index, autoplay) {

			if (index !== _this.config.item) {
				
				this.pause();

				_this.config.item = index;
			
				vimeo.utils.css(_this.player, {
					display: 'none'
				});

				if (typeof autoplay === "boolean") {
					this.config.autoplay = autoplay;
				}
				
				var item = _playlist[index];
				var url = 'http://player.vimeo.com/video/' + item.id + '?';
				var allowed = [	'byline', 'title', 'portrait', 'color',
								'autoplay', 'loop', 'api', 'player_id'];

				for (var i = 0; i < allowed.length; i++) {
					var key = allowed[i];
					if (this.config.hasOwnProperty(key)) {
						var value = _this.config[key];
						if (typeof value === "boolean") value = value ? 1 : 0;
						url += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
					}
				}
				
				if (this.player) {
					this.player.src = url.slice(0, -1);
				}
			}
		};
		
		this.play = function() {
			if (_this.froogaloop) {
				_this.froogaloop.api('paused', function(paused, player_id) {
					if (paused === true) _this.froogaloop.api('play');
				});
			}
		};

		this.pause = function() {
			if (_this.froogaloop) {
				_this.froogaloop.api('paused', function(paused, player_id) {
					if (paused === false) _this.froogaloop.api('pause');
				});
			}
		};
		
		this.events = {
			froogaloopReady: new vimeo.signal(),
			playlist: new vimeo.signal()
		};
	};

	vimeo.api.select = function(identifier) {
		var _container;
		
		if (identifier.nodeType) {
			// Handle DOM Element
			_container = identifier;
		} else if (typeof identifier === "string") {
			// Find container by ID
			_container = document.getElementById(identifier);
		}
		
		if (_container) {
			var foundPlayer = _players[_container.id];
			if (foundPlayer) {
				return foundPlayer;
			} else {
				return _players[_container.id] = new vimeo.api(_container);
			}
		}
		return null;
	};

})(vimeowrap);
