$(document).ready(function () {

    $("a.hourofplanet-fancy").on("click", function (event ) {
        event.preventDefault();

        var cultureTemplate = "";
   
        $("body").prepend("<div id='turnoff_shadow'></div>");

        if (horaplanetaCulture == "es") {

            byCultureTemplate = "<div class='message'><div class='logoHora'>" +
                "<img src='//www.acciona.com/media/3113860/logo-planeta-espanol.jpg' alt='unete a la Hora del Planeta' /></div>" +
                "<h3>EL 30 DE MARZO APAGAMOS LA LUZ POR EL PLANETA</h3>" +
                "<p>Únete a la #HoradelPlaneta y apaga la luz este sábado entre las 20.30 h y las 21.30 h.</p>" +
                "<p>Actúa frente al cambio climático y en favor de la naturaleza.</p>" +
                "<p>Nosotros ya contribuimos a mitigar el calentamiento global. En 2018, hemos evitado la emisión de 14,7 millones de toneladas de CO<sub>2</sub>.</p>" +
                "<img src='/media/3307309/interruptor.png' alt='Actúa' class='switch-btn' />" +
                "<p>¿Cómo te afecta el cambio climático?</p>" +
                "<a href='//www.acciona.com/es/cambio-climatico/' target='_blank' alt='Descúbrelo'>Descúbrelo</a></div>" +
                "<div class='close' style='color:#ffffff'><i class='icon-close'></i></div>";

        }  else {
            byCultureTemplate = "<div class='message'><div class='logoHora'>" +
                "<img src='//www.acciona.com/media/3113861/logo-planeta-ingles.jpg' alt='join Earth Hour' /></div>" +
                "<h3>ON 30 MARCH WE’LL BE SWITCHING OFF THE LIGHTS FOR THE EARTH</h3>" +
                "<p>Join #EarthHour and switch off the power this Saturday between 20.30 and 21.30.  </p>" +
                "<p>Act against climate change and for nature.</p>" +
                "<p>We already contribute to mitigating global warming. In 2018, we avoided the emission of 14.7 million tonnes of CO<sub>2</sub>.</p>" +
                "<img src='/media/3307309/interruptor.png' alt='join Earth Hour' class='switch-btn' />" +
                "<p>How does climate change affect you?</p>" +
                "<a href='//www.acciona.com/climate-change/' target='_blank' alt='Find out'>Find out</a></div>" +
                "<div class='close' style='color:#ffffff'><i class='icon-close'></i></div>";
        }

        $("#turnoff_shadow").prepend(byCultureTemplate);

        //ajustamos altura 
        $("#turnoff_shadow").css("height", $(document).height() + 100).show();

        $("#general").delay(3000).css("visibility", "visible");

        //en click ocultamos
        $(".close").click(function () {
            $("#turnoff_shadow").fadeOut(500);
            $("#turnoff_shadow").remove();
        });

    });


});