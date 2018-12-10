var smallScreenSize = 992;
var minSliderValue = 0; // TODO: To update!
var maxSliderValue = 500; //TODO: To update!

// urlParams  
// TODO: To update!
var minPriceParam = "minPrice";
var maxPriceParam = "maxPrice";
var pageNumberParam = "page";
var itemPerPageParam = "perPage";
var typesParam = "types";
var districtParam = "disctrict";
var variantsParam = "variants";

$(document).ready(function () {
    hideAccordeonsForSmallScreen();
    initPriceSlider(minSliderValue, maxSliderValue);
    initFilters();

    $('.slider-form input').change(function () {
        updatePriceSlider();
    });

    $('.slider-form input').focusout(function () {
        updatePriceSlider();
    });

    $('.catalog-content-section-menu .submit-button').click(function () {
        queryData();
    });

    $('.catalog-content-section-items-per-page .number-label').click(function () {
        activateNumericLabel($(this));
        queryData();
    });
});

//#region Page load actions
function initFilters() {
    if (hasQueryParams()) {
        var minPrice = parseInt(getUrlParam(minPriceParam));
        var maxPrice = parseInt(getUrlParam(maxPriceParam));
        var minPriceValue = !isNaN(minPrice) ? minPrice : minSliderValue;
        var maxPriceValue = !isNaN(maxPrice) ? maxPrice : maxSliderValue;
        updatePriceSliderValues(minPriceValue, maxPriceValue);
        initPriceInputValues(minPriceValue, maxPriceValue);

        var pageNumber = getUrlParam(pageNumberParam).trim();
        setNumberLabels('.catalog-content-section-pagging', pageNumber);

        var itemsPerPage = getUrlParam(itemPerPageParam);
        setNumberLabels('.catalog-content-section-items-per-page', itemsPerPage);

        var types = getUrlParam(typesParam);
        if(types !== undefined) setMenuCheckboxValues('#collapseTypes', types);

        var districts = getUrlParam(districtParam);
        if(districts !== undefined) setMenuCheckboxValues('#collapseDistricts', districts);

        var variants = getUrlParam(variantsParam);
        if(variants !== undefined) setMenuCheckboxValues('#collapseVariants', variants);
    }
}

function hideAccordeonsForSmallScreen() {
    if ($(window).width() < smallScreenSize) {
        var accorderonCards = $('.card .show');

        $.each(accorderonCards, function (index, value) {
            $(value).collapse();
        });
    }
}

function initPriceSlider(minSliderValue, maxSliderValue) {
    $("#slider-range").slider({
        range: true,
        min: minSliderValue,
        max: maxSliderValue,
        values: [minSliderValue, maxSliderValue],
        slide: function (event, ui) {
            $("#amount1").val(ui.values[0]);
            $("#amount2").val(ui.values[1]);
        }
    });
    $("#amount1").val($("#slider-range").slider("values", 0));
    $("#amount2").val($("#slider-range").slider("values", 1));
}

function initPriceInputValues(minPrice, maxPrice) {
    $("#amount1").val(minPrice);
    $("#amount2").val(maxPrice);
}
//#endregion 

//#region Page load action helpers

function hasQueryParams() {
    return window.location.search.length > 0;
}

function getUrlParam(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
            return sParameterName[1];
    }
}

function setNumberLabels(containerClass, activeValue) {
    var labels = $(containerClass).find('.number-label');
    $.each(labels, function (index, value) {
        $(value).removeClass('active');
        if ($(value).text().trim() === activeValue) {
            $(value).addClass('active');
        }
    });
}

function setMenuCheckboxValues(containerId, chechedValues) {
    var labels = $(containerId).find('.form-check-label');
    var checkedValuesArray = convertStringToArray(chechedValues);

    $.each(labels, function (index, value) {
        if ($.inArray($(value).text().trim(), checkedValuesArray) !== -1) {
            $(value).parent().find('.form-check-input').prop('checked', true);
        }
    });
}

//#endregion

//#region Query request

function queryData() {
    var requestUrl = "file:///C:/Users/Aliaksandra_Zakharav/Documents/HardDirtyWork/Skaista/Catalog.html"; // TODO: To update!
    var queryUrl = formQueryString();

    document.location.href = requestUrl + queryUrl;
}

function formQueryString() {
    var minPrice = $('#amount1').val();
    var maxPrice = $('#amount2').val();
    var types = converArrayToString($('#collapseTypes .form-check-input:checkbox:checked')).trim();
    var districts = converArrayToString($('#collapseDistricts .form-check-input:checkbox:checked')).trim();
    var variants = converArrayToString($('#collapseVariants .form-check-input:checkbox:checked')).trim();
    var perPage = $('.catalog-content-section-items-per-page .active').text().trim();
    var pageNumber = $('.catalog-content-section-pagging .active').text().trim();

    var queryString = "";

    queryString = getAppendedQueryString(formAppend(pageNumberParam, pageNumber, queryString), queryString);
    queryString = getAppendedQueryString(formAppend(itemPerPageParam, perPage, queryString), queryString);

    if (parseInt(minPrice) !== minSliderValue) queryString = getAppendedQueryString(formAppend(minPriceParam, minPrice, queryString), queryString);
    if (parseInt(maxPrice) !== maxSliderValue) queryString = getAppendedQueryString(formAppend(maxPriceParam, maxPrice, queryString), queryString);

    queryString = getAppendedQueryString(formAppendIfNotEmpty(typesParam, types, queryString), queryString);
    queryString = getAppendedQueryString(formAppendIfNotEmpty(districtParam, districts, queryString), queryString);
    queryString = getAppendedQueryString(formAppendIfNotEmpty(variantsParam, variants, queryString), queryString);

    return queryString;
}

//#endregion 

//#region Query request helpers

function converArrayToString(elementsArray) {
    var tempArray = [];

    $.each(elementsArray, function (index, value) {
        tempArray.push($(value).parent().find('.form-check-label').text().trim());
    });

    return tempArray.toString();
}

function convertStringToArray(string, splitSymbol = ',') {
    var array = [];

    $.each(string.split(splitSymbol), function (index, value) {
        array.push(decodeURI(value).trim());
    });

    return array;
}

function getUrlConnector(queryString) {
    return queryString.length == 0 ? "?" : "&";
}

function formAppendIfNotEmpty(appendTitle, appendString, queryString) {
    if (appendString.length > 0) {
        return formAppend(appendTitle, appendString, queryString);
    }
    return queryString;
}

function formAppend(appendTitle, appendString, queryString) {
    return queryString + getUrlConnector(queryString) + appendTitle + "=" + appendString;
}

function getAppendedQueryString(appendResult, queryString) {
    if (appendResult !== queryString) {
        return appendResult;
    }
    return queryString;
}

//#endregion 

//#region UI action helpers

function updatePriceSlider() {
    var valueFrom = $("#amount1").val();
    var valueTo = $("#amount2").val();

    updatePriceSliderValues(valueFrom, valueTo);
}

function updatePriceSliderValues(valueFrom, valueTo) {
    if (valueFrom < valueTo && valueFrom >= minSliderValue && valueTo <= maxSliderValue) {
        $("#slider-range").slider({
            values: [valueFrom, valueTo]
        });
    }
}

function activateNumericLabel(clickedElement) {
    if (clickedElement.hasClass('active')) { return; }

    var numberLabels = clickedElement.parent().find('.number-label');
    var checkedIndex = clickedElement.parent().find('.active').index();
    var updatingIndex = clickedElement.index();

	if(clickedElement.hasClass('arrow')){
		if (updatingIndex == 0) {
			if (checkedIndex > 1) updatingIndex = checkedIndex - 1;
			else return;
		}
		if (updatingIndex == numberLabels.length - 1) {
			if (checkedIndex < numberLabels.length - 2) updatingIndex = checkedIndex + 1;
			else return;
		}
	}

    $.each(numberLabels, function (index, value) {
        $(value).removeClass('active');
    });

    var itemToUpdate = !clickedElement.hasClass('arrow') ? clickedElement : numberLabels[updatingIndex];
    $(itemToUpdate).addClass('active');
}

//#endregion 
