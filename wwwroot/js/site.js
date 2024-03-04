$("#roll-dice").click(function () {
    //disable the .die buttons
    $(".die").attr("disabled", "true");
    //start the animations
    for (var j = 0; j < 3; j++) {
        setTimeout(function () {
            //"rolling" the dice
            $.get("/Dice/GetRolledDice", function (data) {
                for (var i = 0; i < data.length; i++) {
                    var die = $("#die" + i);
                    // Check if the die is unlocked before rolling it
                    if (data[i].isLocked === false) {
                        die.text(data[i].value);
                    }
                }
            });
        }, 200 * j);
    }
    //re-enable the .die buttons after the animations have finished
    setTimeout(function () {
        $(".die").removeAttr("disabled");
    }, 200 * 3);
});
//locking-unlocking the die
$(".die").click(function () {
    var index = $(this).attr("id").substring(3);
    var isLocked = !($(this).data("state") === "unlocked");
    $.get("/Dice/LockUnlockDie", { index: index });
    // Toggle the border color and background color
    if (!isLocked) {
        $(this).css("border", "4px dashed red"); // Reset to default color
        $(this).css("background-color", "ivory"); // Reset to default color
        $(this).data("state", "unlocked");
    } else {
        $(this).css("border", "1px dashed red");
        $(this).css("background-color", "red");
        $(this).data("state", "locked");
    }
});