﻿var currentRoll = ["0", "0", "0", "0", "0"];
var combs = ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "3same",
    "4same",
    "5same",
    "3same2same",
    "ss",
    "ls"];
var scores = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
var bonusScores = ["0", "0", "0", "0", "0", "0"];
var rerolls = 3;
var diceImages = ["images/die1.png", "images/die2.png", "images/die3.png", "images/die4.png", "images/die5.png", "images/die6.png"];
for (let i = 0; i < 12; i++) {
    $(`#comb-name-bttn-${i}`).prop("disabled", true);
    $(`#chance-name-bttn`).prop("disabled", true);
}
for (let i = 0; i < 5; i++) {
    let die = $(`#die${i}`);
    die.prop("disabled", true);
    die.children("img").attr("src", diceImages[i]);
}
var rerollClick = function (e) {
    if (rerolls-1 < 0){
        $("#reroll-div").css("color", "grey");
        $("#reroll-button").prop("disabled", true);
        return false;
    }
    rerolls = rerolls - 1;
    rollDiceClick();
    for (let i = 0; i < 12; i++) {
        $(`#comb-name-bttn-${i}`).prop("disabled", true);
        $(`#comb-name-bttn-${i}`).css("color", "ivory");
    }
    console.log("rerolls: " + rerolls);
    e.stopImmediatePropagation();
    return false;
}
var rollDiceClick = function () {
    //init reroll button
    $("#rerolls-amount").html(rerolls);
    $("#reroll-button").prop("disabled", false);


    $(".die").prop("disabled", true);
    $("#roll-dice").prop("disabled", true);
    let intervalRepeatCount = 0;
    for (let i = 0; i < 12; i++) {
        if ($(`#comb-score-${i}`).data("preserved") === true) {
            continue;
        }
        $(`#comb-name-bttn-${i}`).prop("disabled", true);
        $(`#comb-score-${i}`).text("-");
    }
    if ($(`#chance-score`).data("preserved") === false) {
        $(`#chance-name-bttn`).prop("disabled", true);
        $("#chance-score").text("-");
    }
    let diceRollInterval = setInterval(function () {
        $.get("/Dice/GetRolledDice", function (data) {
            for (let i = 0; i < data.length; i++) {
                currentRoll[i] = data[i].value;
                if (data[i].isLocked === false) {
                    $(`#die${i}`).children("img").attr("src", diceImages[data[i].value - 1]);
                }
            }
        }, "json");
        if (intervalRepeatCount === 2) {
            clearInterval(diceRollInterval);
            return;
        }
        intervalRepeatCount++;
    }, 200);
    ShowAvailableCombinations();
    AreNoCombsAvailable();
    return false;
}
var ShowAvailableCombinations = function () {
    setTimeout(function () {
        for (let i = 0; i < 12; i++) {
            if ($(`#comb-score-${i}`).data("preserved") === true) {
                continue;
            }
            $(`#comb-name-bttn-${i}`).prop("disabled", false);
        }
        $(".die").prop("disabled", false);
        console.log("current-roll: " + currentRoll);
        $.post("/Dice/CombinationChecker", { rolls: JSON.stringify(currentRoll) }, function (response) {
            for (let i = 0; i < response.length; i++) {
                console.log(`${combs[i]}:${response[i]}`);
                if (response[i]) {
                    if ($(`#comb-score-${i}`).data("preserved") === true) {
                        continue;
                    }
                    $(`#comb-name-bttn-${i}`).attr("data-available", "1"); //"enable" combination button
                    $(`#comb-name-${i}`).css("background-color", "#d7ffc9");//set bgcolor to greenish if true returned
                    $(`#comb-name-bttn-${i}`).css("color", "#111111");
                } else {
                    $(`#comb-name-bttn-${i}`).attr("data-available", "0"); //disable combination button
                }
            }
        });
        if ($(`#chance-score`).data("preserved") === false) {
            $(`#chance-name-bttn`).attr("data-available", "1"); //enable combination button
            $(`#chance-name-bttn`).prop("disabled", false);
            $(`#chance-name`).css("background-color", "#d7ffc9");//set bgcolor to greenish if true returned        
            $(`#chance-name-bttn`).css("color", "#111111");
        }
    }, 700);
    return false;
}
var CombClick = function () {
    let id = this.id.split("-").pop(); //id from button
    if ($(`#comb-name-bttn-${id}`).attr("data-available") === "1" || $(`#comb-score-${id}`).data("preserved") === false) {
        $.ajax({
            url: "/Score/CombinationScoreCalc",
            type: "POST",
            data: { buttonId: id, rolls: JSON.stringify(currentRoll) },
            success: function (score) {
                $(`#comb-score-${id}`).text(score);
                $(`#comb-score-${id}`).data("preserved", true); //adding custom attribute "preserved" for score <td>
            }
        });
    }
    for (let i = 0; i < 12; i++) {
        $(`#comb-name-bttn-${i}`).prop("disabled", true); //disable combination buttons
        $(`#comb-name-bttn-${i}`).css("color", "ivory");
    }
    if ($(`#comb-name-bttn-${id}`).attr("data-available") === "0" || $(`#comb-score-${id}`).data("preserved") === false) {
        $(`#comb-score-${id}`).text(0);
        $(`#comb-score-${id}`).data("preserved", true)
    }
    //disable chance button
    $(`#chance-name-bttn`).attr("data-available", "0");
    $("#chance-name-bttn").prop("disabled", true);
    $(`#chance-name-bttn`).css("color", "ivory");
    $("#roll-dice").prop("disabled", false);

    BonusCheck();
    FinishCheck();
    rerolls = 3;
    return false;
}
var ChanceCombClick = function () {
    let chanceSum = currentRoll.reduce(function (a, b) {
        return a + b;
    }, 0);
    $("#chance-score").text(chanceSum);
    $("#chance-score").data("preserved", true);
    $(`#chance-name-bttn`).attr("data-available", "0");
    $("#chance-name-bttn").prop("disabled", true);
    $(`#chance-name-bttn`).css("color", "ivory");
    $("#roll-dice").prop("disabled", false);
    for (let i = 0; i < 12; i++) {
        $(`#comb-name-bttn-${i}`).prop("disabled", true);
        $(`#comb-name-bttn-${i}`).css("color", "ivory");
        $(`#comb-name-bttn-${i}`).attr("data-available", "0");
        $(`#comb-name-${i}`).css("background-color", "");
    }
    $("#roll-dice").prop("disabled", false);
    rerolls = 3;
}
var AreNoCombsAvailable = function () {
    setTimeout(function () {

        for (let i = 0; i < 12; i++) {
            if ($(`#comb-name-bttn-${i}`).attr("data-available") === "1") {
                return; //return early if one of the comb-buttons is enabled
            }
        }
        if ($("#chance-name-bttn").attr("data-available") === "1") {
            return; //return early if chance-button is enabled
        }
        //all buttons are disabled - enable roll-dice button
        $("#roll-dice").prop("disabled", false);
    }, 1500);
}
var BonusCheck = function () {
    setTimeout(function () {
        for (let i = 0; i < 6; i++) {
            if ($(`#comb-score-${i}`).text() === "-") { return; }
        }
        for (let i = 0; i < 6; i++) {
            bonusScores[i] = parseInt($(`#comb-score-${i}`).text());
        }
        let lowerSectSum = bonusScores.reduce(function (a, b) {
            return a + b;
        }, 0);
        if (lowerSectSum >= 63) {
            $("#bonus-score").text(35);
            return;
        }
        $("#bonus-score").text(0);
    }, 350);
}
var FinishCheck = function () {
    setTimeout(function () {
        for (let i = 0; i < 12; i++) {
            if ($(`#comb-score-${i}`).text() === "-") {
                return; //return early if one of the comb-buttons is not calculated
            }
        }
        if ($("#chance-score").text() === "-" || $("#bonus-score").text() === "-") {
            return; //return early if chance-button is not calculated
        }
        $("#roll-dice").prop("disabled", true);
        //all buttons are disabled - enable roll-dice button
        for (let i = 0; i < 12; i++) {
            scores[i] = parseInt($(`#comb-score-${i}`).text());
        }
        scores[12] = parseInt($(`#bonus-score`).text());
        scores[13] = parseInt($(`#chance-score`).text());
        let overallScore = scores.reduce(function (a, b) {
            return a + b;
        }, 0);
        $("#overall-score").text(overallScore);
    }, 500);
}
$("#reroll-button").prop("disabled", true);
$("#reroll-button").on("click", rerollClick);
$("#roll-dice").on("click", rollDiceClick);
for (let i = 0; i < 12; i++) {
    $(`#comb-name-bttn-${i}`).on("click", CombClick);
}
$(`#chance-name-bttn`).on("click", ChanceCombClick);