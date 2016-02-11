//on load
$(function () {
$("#addForm").submit(function (e) {

    var url = $(this).attr("action"); // the script where you handle the form input.

    $.ajax({
        type: "POST",
        url: url,
        data: $(this).serialize(), // serializes the form's elements.
        success: function (data) {
            $($(This).parent).add($("<tr/>")).append("<td>"+$("#city").text+"<td/>")// show response from the php script.
        }
    });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});

$(".deleteForm").submit(function (e) {

    var url = $(this).attr("action"); // the script where you handle the form input.
    var This = $(this);
    $.ajax({
        type: "POST",
        url: url,
        data: $(this).serialize(), // serializes the form's elements.
        success: function (data) {
            $($(This).parent).remove();
        }
    });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});


var i = 0;
    //Looping through each row of table adn get() request for each city
    $("tr").each(function () {
        if ($($(this).children("td:eq(0)")).text() != "City") {
            var req = "https://query.yahooapis.com/v1/public/yql?q=" + 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + $(this).children("td:eq(0)").text() + '")'+"&format=json";
            console.log(req);
            $.get(req, function (data) {
                alert(data['query']['results']['channel']['item']['condition']['temp'] + data['query']['results']['channel']['units']['temperature']);
                //alert(1+$("tr:eq(" + i + ")").children("td:eq(1)").text());
                var That = $("tr:eq(" + i + ")").children("td:eq(1)"); //$($(this).children("td:eq(1)"));
                $(That).attr("class", "");
                $(That).text(data['query']['results']['channel']['item']['condition']['temp'] + data['query']['results']['channel']['units']['temperature']);
            });
        }
        i++;
    })
});
