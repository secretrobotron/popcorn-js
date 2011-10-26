test( "Popcorn Image Plugin", function() {

  var popped = Popcorn( "#video" ),
      expects = 9,
      count = 0,
      setupId,
      imagediv = document.getElementById( "imagediv" ),
      sources = [
        "https://www.drumbeat.org/media//images/drumbeat-logo-splash.png",
        "http://www.petmountain.com/category/mini/organic-dog-supplies/520/organic-dog-supplies.jpg",
        "http://www.botskool.com/sites/default/files/images/javascript.png"
      ];

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  stop();

  ok( "image" in popped, "image is a method of the popped instance" );
  plus();

  equals( imagediv.innerHTML, "", "initially, there is nothing inside the imagediv" );
  plus();

  popped.image({
    // seconds
    start: 1,
    // seconds
    end: 3,
    href: "http://www.drumbeat.org/",
    src: sources[ 0 ],
    text: "DRUMBEAT",
    target: "imagediv"
  })
  .image({
    // seconds
    start: 4,
    // seconds
    end: 6,
    // no href
    src: sources[ 1 ],
    target: "imagediv"
  })
  .image({
    // seconds
    start: 5,
    // seconds
    end: 6,
    // no href
    src: sources[ 2 ],
    target: "imagediv"
  });

  setupId = popped.getLastTrackEventId();

  popped.exec( 2, function() {
    ok( /display: block;/.test( imagediv.innerHTML ), "Div contents are displayed" );
    plus();
    ok( /img/.test( imagediv.innerHTML ), "An image exists" );
    plus();
  });

  popped.exec( 3, function() {
    ok( /display: none;/.test( imagediv.innerHTML ), "Div contents are hidden again" );
    plus();
  });

  popped.exec( 5, function() {
    [].forEach.call( document.querySelectorAll( "#imagediv a img" ), function( img, idx ) {
      ok( img.src === sources[ idx ], "Image " + idx + " is in the right order" );
      plus();
    });
  });

  popped.exec( 7, function() {
    popped.pause().removeTrackEvent( setupId );
    ok( !imagediv.children[ 2 ], "removed image was properly destroyed" );
    plus();
  });

  popped.volume( 0 ).play();
});

test( "Image input cleansing", function() {

  var popped = Popcorn( "#video" ),
      expects = 2,
      count = 0,
      imagediv = document.getElementById( "imagediv" ),
      source = "https://www.drumbeat.org/media//images/drumbeat-logo-splash.png";

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  stop();

  imagediv.innerHTML = "";

  popped.image({
    start: 9,
    end: 11,
    href: "    javascript:window.epic='fail';",
    src: source,
    text: "<div><script><test><tests /></test></script></div>",
    target: "imagediv"
  });

  popped.exec( 10, function() {
    var href = imagediv.getElementsByTagName( "a" )[ 0 ].href;
    ok( href === window.location.href, "href javascript was removed" );
    plus();
    ok( imagediv.getElementsByTagName( "div" )[ 0 ].textContent, 
        "&lt;div&gt;&lt;script&gt;&lt;test&gt;&lt;tests /&gt;&lt;/test&gt;&lt;/script&gt;&lt;/div&gt;",
        "image text is tagless" );
    plus();
  });

  popped.volume( 0 ).play( 0 );

});
