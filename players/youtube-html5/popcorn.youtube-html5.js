(function() {

  var DEFAULT_WIDTH = "560",
      DEFAULT_HEIGHT = "315";

  var __youTubeReadyListeners = [],
      __oldYouTubeReadyListener
      __urlRegex = /^.*(?:\/|v=)(.{11})/;

  // Fire the things that were waiting
  function fireYouTubeReadyListeners() {
    var listeners = __youTubeReadyListeners;
    for ( var i=0; i<listeners.length; ++i ) {
      listeners[ i ]();
    } //for
    if ( __oldYouTubeReadyListener ) {
      __oldYouTubeReadyListener();
    } //if
  } //fireYouTubeReadyListeners

  // Don't stomp on something that was already listening
  if ( window.onYouTubePlayerAPIReady ) {
    __oldYouTubeReadyListener = window.onYouTubePlayerAPIReady;
  } //if
  window.onYouTubePlayerAPIReady = fireYouTubeReadyListeners;

  if ( !window.YT ) {
    var script = document.createElement( "script" );
    script.src = "http://www.youtube.com/player_api";
    if ( document.head ) {
      document.head.appendChild( script );
    }
    else if ( document.body ) {
      document.body.appendChild( script );
    }
    else {
      document.write( '<script src="' + script.src + '"></script>' );
    } //if
  } //if

  Popcorn.player( "youtubehtml5", {

    _setup: function( setupOptions ) {

      var _media = this,
          _youtube,
          _container = document.createElement( "div" ),
          _src = __urlRegex.exec( _media.src )[ 1 ],
          _query = ( _media.src.split( "?" )[ 1 ] || "" ).replace( /v=.{11}/, "" ),
          _width = _media.style.width ? "" + _media.offsetWidth : DEFAULT_WIDTH,
          _height = _media.style.height ? "" + _media.offsetHeight : DEFAULT_HEIGHT
          _currentTime = 0,
          _startCurrentTime = setupOptions.start || 0,
          _startMuted = false,
          _startVolume = 0,
          _volume = 0,
          _volumeCheckInterval = -1,
          _seeking = false,
          _playerVars = {
            autohide: setupOptions.autohide,
            autoplay: setupOptions.autoPlay,
            controls: setupOptions.controls,
            enablejsapi: 1,
            loop: setupOptions.loop,
            origin: setupOptions.origin,
            playlist: setupOptions.playlist,
            start: setupOptions.start,
            theme: setupOptions.theme
          };

      function update() {
        var val = _youtube.getVolume() / 100;
        if ( _volume !== val ) {
          _volume = val;
          _media.dispatchEvent( "volumechange" );
        } //if
        var _currentTime = _youtube.getCurrentTime();
        if ( _seeking && _seeking === _currentTime ) {
          _seeking = false;
          _media.dispatchEvent( "seeked" );
        } //if
        _media.dispatchEvent( "timeupdate" );
      } //update

      function onPlayerReady( e ) {
        Object.defineProperties( _media, {
          currentTime: {
            get: function() {
              return _currentTime;
            },
            set: function( val ) {
              _seeking = val;
              _youtube.seekTo( val );
            }
          },
          muted: {
            get: function() {
              return _youtube.isMuted();
            },
            set: function( val ) {
              if ( _youtube.isMuted() !== val ) {
                if ( val ) {
                  _youtube.mute();
                }
                else {
                  _youtube.unmute();
                } //if
                _media.dispatchEvent( "volumechange" );
              } //if
            }
          },
          volume: {
            get: function() {
              return _volume;
            },
            set: function( val ) {
              _volume = val;
              _youtube.setVolume( val * 100 );
              _media.dispatchEvent( "volumechange" );
            }
          }
        });

        _media.duration = _youtube.getDuration();
        _media.dispatchEvent( "durationchange" );

        // set the mute and volume, but not currentTime since it should happen automagically
        _media.muted = _startMuted;
        _media.volume = _startVolume;

        _volumeCheckInterval = setInterval( update, 10 );

      } //onPlayerReady

      function onPlayerStateChange( e ) {
        if ( e.data === -1 ) {
          _media.dispatchEvent( "load" );
        }
        else if ( e.data === YT.PlayerState.ENDED ) {
        }
        else if ( e.data === YT.PlayerState.PLAYING ) {
        }
        else if ( e.data === YT.PlayerState.PAUSED ) {
        }
        else if ( e.data === YT.PlayerState.BUFFERING ) {
        }
        else if ( e.data === YT.PlayerState.CUED ) {
          _media.readyState = 4;
          _media.dispatchEvent( "canplay" );
          _media.dispatchEvent( "canplaythrough" );
          _media.dispatchEvent( "loadeddata" );
        } //if
      } //onPlayerStateChange

      function onPlaybackQualityChange( e ) {
      } //onPlaybackQualityChange

      function onError( e ) {
      } //onError

      function onYouTubeReady() {
        _youtube = new YT.Player( _container, {
          height: _height,
          width: _width,
          videoId: _src,
          playerVars: _playerVars,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onPlaybackQualityChange': onPlaybackQualityChange,
            'onError': onError
          }
        });

        mediaElement = document.getElementById( _media.id );
        if ( mediaElement ) {
          mediaElement.appendChild( _container );
        } //if

      } //onYouTubeReady

      _media.play = function( time ) {
        _youtube.playVideo();
      };

      _media.pause = function( time ) {
        _youtube.pauseVideo();
      };

      // Dummy functionality setup before player actually loads
      Object.defineProperties( _media, {
        currentTime: {
          get: function() {
            return _startCurrentTime;
          },
          set: function( val ) {
            _startCurrentTime = val;
          }
        },
        muted: {
          get: function() {
            return _startMuted;
          },
          set: function( val ) {
            _startMuted = val;
          }
        },
        volume: {
          get: function() {
            return _startVolume;
          },
          set: function( val ) {
            _startVolume = val;
          }
        }
      });

      if ( !window.YT ) {
        __youTubeReadyListeners.push( onYouTubeReady );
      }
      else {
        onYoutubeReady();
      } //if

    }

  });
  
})();
