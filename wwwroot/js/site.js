var rolls = ["0", "0", "0", "0", "0"];
var clickHandler = function (e) {
    setTimeout(function () {
        $.get('/Dice/GetRolledDice', function (data) {
            for (var i = 0; i < 12; i++) {
                $(`#comb-score-${i}`).text("-");
            }
            $(".die").prop("disabled", true);
            setTimeout(function () {
                for (var i = 0; i < data.length; i++) {
                    finalRoll = data;
                    var die = $("#die" + i);
                    rolls[i] = data[i].value;
                    // Check if the die is unlocked before rolling it
                    if (data[i].isLocked === false) {
                        die.text(data[i].value);
                    }
                }
            }, 250);
            $(".die").prop("disabled", false);
        }, 'json');
    }, 200);
    setTimeout(function () {
        console.log(rolls);
        $.post("/Dice/CombinationChecker", { rolls: JSON.stringify(rolls) }, function (response) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                if (response[i]) {
                    $(`#comb-name-${i} button`).prop("disabled", false); // Enable button
                    $(`#comb-name-${i}`).css("background-color", "#d7ffc9");
                } else {
                    $(`#comb-name-${i} button`).prop("disabled", true); // Disable button
                    $(`#comb-name-${i}`).css("background-color", ""); // Reset background color
                }
            }
        });
    }, 600);
    e.stopImmediatePropagation();
    return false;
}
$("#roll-dice").on('click', clickHandler);
