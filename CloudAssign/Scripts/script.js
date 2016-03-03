//on load
var That = "";
$(function () {
    //Checking if the user is loged in.
    var user = getCookie("user");
    if (user != "") {
        $("#user").html(user +", "+ "<a href='#' onclick='logout()'>Logout</a>")
    }
    
   
    $.get("http://ip-api.com/json", function (data) {
        var city = (data["city"] + ", " + data["country"]);
        var req = "https://query.yahooapis.com/v1/public/yql?q=" + 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' +city + '")' + "&format=json";

        $.get(req, function (innerData) {
            $("#location").html(city + ": " + innerData['query']['results']['channel']['item']['condition']['temp'] + innerData['query']['results']['channel']['units']['temperature']);
        });
    });
$("#addForm").submit(function (e) {
    var url = $(this).attr("action"); // the script where you handle the form input.
    $.ajax({
        type: "POST",
        url: url,
        data: $(this).serialize(), // serializes the form's elements.
        success: function (data) {
            if ($("td:contains('" + $("#city").val() + "')").length < 1)
            $("tbody").append($("<tr/>").append($("<td>" + $("#city").val() + "</td><td>Refresh</td>" +
                '<td><form  method="post" class="deleteForm" action="/Home/remove?city='+$("#city").val()+'"><button type="submit" class="glyphicon-remove glyphicon" style="background-color:transparent; display:block; border:none" ></button></form></td>')))// show response from the php script.
        }
    });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});

$("body").click(function () {
    $(".deleteForm").submit(function (e) {
        var url = $(this).attr("action"); // the script where you handle the form input.
        That = $(this).parent().parent();
        $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(), // serializes the form's elements.
            success: function (data) {
                $(That).remove();
            }
        });

        e.preventDefault(); // avoid to execute the actual submit of the form.
    });
});
    //Looping through each row of table adn get() request for each city
    $("tr").each(function () {
        if ($($(this).children("td:eq(0)")).text() != "City") {
            var req = "https://query.yahooapis.com/v1/public/yql?q=" + 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + $(this).children("td:eq(0)").text() + '")' + "&format=json";
            var That = $(this);
            $.get(req, function (data) {
                $(That).children("td:eq(1)").attr("class", "");
                $(That).children("td:eq(1)").text(data['query']['results']['channel']['item']['condition']['temp'] + data['query']['results']['channel']['units']['temperature']);
            });
        };
    })
});

//get cookie by name
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

//Logout
function logout(){
    setCookie("user", "", 2);
    $("#user").html('<a href="/Home/CheckAuthorization"><img src="/Images/loginfb.png" /></a>')
}
//Set cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
