$(document).ready(function(){
	$(".fancyGraph").each(function(){
		
		var objGraph =$(this);
		
		var padre =$(this).parent();
		
		padre.append("<a class='fancyGraphLink'></a>");
		
		
		$(this).remove();
		
		$("a.fancyGraphLink").attr("href","ShowGraph?img="+objGraph.attr("src")+"&alt="+objGraph.attr("alt"));		
		
		$("a.fancyGraphLink").append(objGraph);
								
		
	});

        $('a.fancyOds').fancybox({
            'title': '',
            'type': 'ajax',
            'fitToView': true,
            'autoDimensions':true,
            'beforeClose': function () {
                if ($('html').is('#ie9')) {
                    location.reload();
                }
            },
            'closeClick': true
        });	
		$('a.fancyGraphLink').fancybox({
					'title': '',
					'type' : 'iframe',
					'fitToView': false,
					
					'beforeClose': function() {
						   if ($('html').is('#ie9')) {
      						location.reload();
    						}
					},
					'closeClick': true		
			});	
	
		$(".fancyboxgal").fancybox({
			//afterLoad: function() {					
			//	this.title = '<a href="' + this.href + '/saveImageAs" target="_blank" style="font-size:1.2em;float:right;"><span class="pdf-info">Descargar</span></a> ' + this.title;
			//},
			'type': 'iframe',
			//'width': 768,
			//'height': 518,
			'transitionIn' : 'elastic',
			'transitionOut' : 'elastic',
			'overlayColor': '#000000',
			'overlayOpacity': '0.4',
			'padding' : 0,
			'wmode': 'transparent',
			'scrolling': 'no',
			centerOnScroll: true,
			'beforeClose': function() {
			   if ($('html').is('#ie9')) {
    				location.reload();
    			}
			},
			openEffect: 'none',
            closeEffect: 'none',
            iframe: {
              preload: false // fixes issue with iframe and IE
          	},
			
			'closeClick': true
			//helpers : {
		//		title: {
	//				type: 'inside'
	//			}
	//		}
		});	

    $(".fancyboxgal_full-screen").fancybox({
        'type': 'iframe',
        'width': '100%',
        'height': '100%',
        'wrapCSS':'full-width-lb',
        'overlayColor': '#000000',
        'overlayOpacity': '0.4',
        'padding': 0,
        'scrolling': 'no',
        iframe: {
            scrolling: 'yes',
            preload: false // fixes issue with iframe and IE
        }
    });	

	
		$(".fancyboxJunta").fancybox({
			//afterLoad: function() {					
			//	this.title = '<a href="' + this.href + '/saveImageAs" target="_blank" style="font-size:1.2em;float:right;"><span class="pdf-info">Descargar</span></a> ' + this.title;
			//},
			'type': 'iframe',
			'width': 768,
			'height': 518,
			'transitionIn' : 'elastic',
			'transitionOut' : 'elastic',
			'overlayColor': '#000000',
			'overlayOpacity': '0.4',
			'padding' : 0,
			'wmode': 'transparent',
			'scrolling': 'no',
			centerOnScroll: true,
			'beforeClose': function() {
			   if ($('html').is('#ie9')) {
    				location.reload();
    			}
			},
			openEffect: 'none',
            closeEffect: 'none',
            iframe: {
              preload: false // fixes issue with iframe and IE
          	},
			
			'closeClick': true
			//helpers : {
		//		title: {
	//				type: 'inside'
	//			}
	//		}
		});											
	
	
});