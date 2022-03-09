$(function() {

    start();

    function start(){
        $("#screen2").hide();

        // Generate Contribuition Time Options on index document
        (function() {
            for (let months = 2; months <= 20; months++) {
                const value = months;
                
                // Formatting the text for each option
                const text = Math.floor(months / 21) != 0
                                ? Math.floor(months / 21)
                                : months % 21;
                
                const optionElement = $("<option></option>");
                optionElement.val(value);
                optionElement.text(text);

                $("#contributionTime").append(optionElement);
            }
        })();
    }

    function changeScreen(){
        $("#screen1").slideToggle("slow");
        $("#screen2").fadeToggle("slow");
    }

    $("#inputForm").on("submit", function() { 

        const name = $("#name").val();
        const payment = $("#payment").val();
        const contributionTime = $("#contributionTime").val();
        const debit = 20 / 100;
        const contributionTime_formatted = $(`#contributionTime option[value='${contributionTime}']`).text();
        const interestRate = 25 / 100;

        // Validating the input
        if (name === "" || name === undefined){
            return 0;
        }
        if (parseFloat(payment) <= 0 || isNaN(parseFloat(payment))){ // Checking if payment it's a number and if it's positive
            return 0;
        }

        // Formatting the user input into a math expression to send for the API
        const expression = `${payment} * (${interestRate}) * (${contributionTime})`;
        
        $.ajax({
            type: 'POST',
            url: 'https://api.mathjs.org/v4/',
            dataType: 'json',
            contentType: 'application/json',

            data: JSON.stringify( { "expr": expression } ),

            success: (function(data){
                // Format the user input and the data receive
                // by the ajax request.

                // Formatting for float with 2 decimals places and
                // formatting periods to commas
                let result = parseFloat(data["result"]);
                result = result.toFixed(2);
                result = result.replace(".", ",");

                let payment_formatted = parseFloat(payment);
                payment_formatted = payment_formatted.toFixed(2);
                payment_formatted = payment_formatted.replace(".", ",");
                
                const dto = `${result} * (${debit})`;
                
                // Formatting the query of the output
                const output = `Olá <strong>${name}</strong>, aplicando <strong>${payment_formatted} Kz</strong> na ozono,
                você terá <strong>${result} Kz</strong> de rendimento em <strong>${contributionTime} </strong>meses.`;

                $("#outputText").html(output);
            }),

            error: function (resp) {
                $("#outputText").html("<strong>Parece que algo deu errado!</strong> Por favor, simule novamente.");
            }
        });

        changeScreen();
                                              
    });

    $("#simulateAgain").on("click", changeScreen);

})