$(document).ready(function () {
    var minSliderValue = 0;
    var maxSliderValue = 500;
    var src = $(window).width() > 992
        ? 'https://maps.google.com/maps?q=Revolu%C4%8Dn%C3%AD%20767%2F25%2C%20Star%C3%A9%20M%C4%9Bsto%2C%20Praha%201%2C%20110%2000&t=&z=13&ie=UTF8&iwloc=&output=embed&ll=50.096478,14.550421'
        : 'https://maps.google.com/maps?q=Revolu%C4%8Dn%C3%AD%20767%2F25%2C%20Star%C3%A9%20M%C4%9Bsto%2C%20Praha%201%2C%20110%2000&t=&z=13&ie=UTF8&iwloc=&output=embed';

    $('#map iframe').attr('src', src);
    $("#slider-range").slider({
        range: true,
        min: minSliderValue,
        max: maxSliderValue,
        values: [100, 300],
        slide: function (event, ui) {
            $("#amount1").val(ui.values[0]);
            $("#amount2").val(ui.values[1]);
        }
    });
    $("#amount1").val($("#slider-range").slider("values", 0));
    $("#amount2").val($("#slider-range").slider("values", 1));

    $('.place-card-large').css('display', 'none !important');

    $('.slider-form input').change(function() {
        var valueFrom = $("#amount1").val();
        var valueTo = $("#amount2").val();

        if (valueFrom < valueTo && valueFrom > minSliderValue && valueTo < maxSliderValue) {
            $("#slider-range").slider({
                values: [valueFrom, valueTo]
            });
        }
    });

    $('.number-label').click(function() {
        if ($(this).hasClass('active')) { return;}

        var numberLabels = $(this).parent().find('.number-label');
        var checkedIndex = $(this).parent().find('.active').index();
        var updatingIndex = 0;

        $.each(numberLabels, function(index, value) {
            $(value).removeClass('active');
        });

        var itemToUpdate = !$(this).hasClass('arrow') ? $(this) : numberLabels[checkedIndex + 1];
        $(itemToUpdate).addClass('active');
    });

    if ($(window).width() < 992) {
        $('.card-header button').addClass('collapsed');
    }
});