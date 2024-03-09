var rolls = ["0", "0", "0", "0", "0"];
var rolls2 = [1,2,3,4,5];
var rollDiceClick = function (e) {
    $(".die").prop("disabled", true);
    $("#roll-dice").prop("disabled", true);
    var intervalRepeatCount = 0;
    for (var k = 0; k < 12; k++) {
        if ($(`#comb-score-${k}`).data('preserved') === true) {
            continue;
        }
        $(`#comb-score-${k}`).text("-");
    }
    if ($(`#chance-score`).data('preserved') === false) {
        $("#chance-score").text("-");
    }
    var diceInterval = setInterval(function () {
            $.get('/Dice/GetRolledDice', function (data) {
                for (var i = 0; i < data.length; i++) {
                    var die = $("#die" + i);
                    rolls[i] = data[i].value;
                    if (data[i].isLocked === false) {
                        die.text(data[i].value);
                    }
                }
            }, 'json');
        if (intervalRepeatCount === 2) { clearInterval(diceInterval); return; }
        intervalRepeatCount++;
    }, 300);
    ShowAvailableCombinations();
    e.stopImmediatePropagation();
    return false;
}
var ShowAvailableCombinations = function (e) {
    setTimeout(function () {
        console.log(rolls);
        $.post("/Dice/CombinationChecker", { rolls: JSON.stringify(rolls) }, function (response) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                if (response[i]) {
                    if ($(`#comb-score-${i}`).data('preserved') === true) {
                        continue;
                    }
                    $(`#comb-name-bttn-${i}`).prop("disabled", false); //enable combination button
                    $(`#comb-name-${i}`).css("background-color", "#d7ffc9");//set bgcolor to greenish if true returned
                } else {
                    $(`#comb-name-bttn-${i}`).prop("disabled", true); //disable combination button
                    $(`#comb-name-${i}`).css("background-color", ""); //reset bgcolor
                }
            }
        });
        if ($(`#chance-score`).data('preserved') === false) {
            $(`#chance-name-bttn`).prop("disabled", false); //enable combination button
            $(`#chance-name`).css("background-color", "#d7ffc9");//set bgcolor to greenish if true returned        
        }
        
    }, 1000);
    e.stopImmediatePropagation();
    return false;
}
var CombClick = function (e) {
    var id = this.id.split('-').pop(); //id from button
    $.ajax({
        url: '/Score/CombinationScoreCalc',
        type: 'POST',
        data: { buttonId: id, rolls: JSON.stringify(rolls) },
        success: function (score) {
            
            $(`#comb-score-${id}`).text(score);
        }
    });
    $(`#comb-score-${id}`).data('preserved', true); //adding custom attribute "preserved" for score <td>
    for (var i = 0; i < 12; i++) {
        $(`#comb-name-bttn-${i}`).prop('disabled', true); //disable combination buttons
        $(`#comb-name-${i}`).css("background-color", "");
    }
    $(`#chance-name-bttn`).prop("disabled", true); //disable chance button
    $("#roll-dice").prop("disabled", false);
    e.stopImmediatePropagation();
    return false;
}
var ChanceCombClick = function (e) {
    var chanceSum = rolls.reduce(function (a, b) {
        return a + b;
    }, 0);
    $("#chance-score").text(chanceSum);
    $("#chance-score").data('preserved', true);
    $("#chance-name-bttn").prop("disabled", true);
    for (var i = 0; i < 12; i++) {
        $(`#comb-name-bttn-${i}`).prop('disabled', true); 
        $(`#comb-name-${i}`).css("background-color", "");
    }
    $("#roll-dice").prop("disabled", false);
}
$("#roll-dice").on('click', rollDiceClick);
for (var i = 0; i < 12; i++) {
    $(`#comb-name-bttn-${i}`).on('click', CombClick);
}
$(`#chance-name-bttn`).on('click', ChanceCombClick);