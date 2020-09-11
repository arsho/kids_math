$(document).ready(function(){

    var valid_operators = {
        "addition": "+",
        "substraction": "-",
        "multiplication": "x",
        "division": "÷"
    };

    function get_random_integer(min_number, max_number){
        return Math.floor(Math.random() * (max_number - min_number + 1) + min_number);
    }

    function get_random_operator(operators){
        operator = operators[Math.floor(Math.random() * operators.length)]
        if(valid_operators.hasOwnProperty(operator)){
            return valid_operators[operator];
        }
        valid_operators_keys = Object.keys(valid_operators);
        var random_index = Math.floor(Math.random() * valid_operators_keys.length);
        random_operator = valid_operators[valid_operators_keys[random_index]];
        return random_operator;
    }

    function get_correct_answer(operand_1, operand_2, operator){
        correct_answer = NaN;
        switch (operator) {
            case valid_operators["addition"]:
            correct_answer = operand_1 + operand_2;
            break;
            case valid_operators["substraction"]:
            correct_answer = operand_1 - operand_2;
            break;
            case valid_operators["multiplication"]:
            correct_answer = operand_1 * operand_2;
            break;
            case valid_operators["division"]:
            correct_answer = Math.floor(operand_1 / operand_2);
            break;
            default:
            break;
        }
        return correct_answer;
    }

    function get_a_question_div(question){
        return `<div class="row text-white rounded bg-dark text-center align-items-center quiz-box mb-2">
            <div class="col">
                ${question["operand_1"]}
            </div>
            <div class="col">
                ${question["operator"]}
            </div>
            <div class="col">
                ${question["operand_2"]}
            </div>
            <div class="col">
                =
            </div>
            <div class="invisible correct-answer">
                ${question["correct_answer"]}
            </div>
            <div class="col">
                <input class="answer-input" type="text">
            </div>
        </div>`;
    }

    function get_quiz_settings(){
        $student_name = $("#student_name").val();
        $max_number_operand_1 = parseInt($("#max_number_operand_1").val());
        if(!$max_number_operand_1){
            $max_number_operand_1 = 30;
        }
        $max_number_operand_2 = parseInt($("#max_number_operand_2").val());
        if(!$max_number_operand_2){
            $max_number_operand_2 = 15;
        }
        $number_of_questions = parseInt($("#number_of_questions").val());
        $quiz_language = $("#quiz_language").val();
        $type_of_questions = $("#type_of_questions").val();
        if($type_of_questions.length === 0){
            $type_of_questions = ["random"];
        }
        return {
            "student_name": $student_name,
            "max_number_operand_1": $max_number_operand_1,
            "max_number_operand_2": $max_number_operand_2,
            "number_of_questions": $number_of_questions,
            "type_of_questions": $type_of_questions,
            "quiz_language": $quiz_language
        };
    }

    function get_quiz_data(quiz_settings){
        quiz_data = [];
        operators = quiz_settings["type_of_questions"];
        max_number_operand_1 = quiz_settings["max_number_operand_1"];
        max_number_operand_2 = quiz_settings["max_number_operand_2"];
        min_number = 0;
        for(var i = 0; i < quiz_settings["number_of_questions"]; i++){
            var question = {};
            var operand_1 = get_random_integer(min_number, max_number_operand_1);
            var operand_2 = get_random_integer(min_number, max_number_operand_2);
            var operator = get_random_operator(operators);
            question["correct_answer"] = get_correct_answer(operand_1, operand_2, operator);
            question["operand_1"] = operand_1;
            question["operand_2"] = operand_2;
            question["operator"] = operator;
            quiz_data.push(question);
        }
        return quiz_data;
    }

    $("#generate_quiz").on("click", function(){
        quiz_settings = get_quiz_settings();
        console.log(quiz_settings);
        $("#quiz_box").removeClass("invisible");
        $("#quiz_settings_box").collapse('hide');
        quiz_data = get_quiz_data(quiz_settings);
        $("#quiz_box").html("");
        for(i = 0; i < quiz_data.length; i++){
            $("#quiz_box").append(get_a_question_div(quiz_data[i]));
        }
    });

    $("body").on("focusout", "input.answer-input", function(event){
        current_value = $(this).val();
        correct_anwer = $(this).closest(".quiz-box").find(".correct-answer").text().trim();
        if(current_value === correct_anwer){
            $(this).closest(".quiz-box").removeClass("bg-dark");
            $(this).closest(".quiz-box").addClass("bg-success");
        }
        else{
            $(this).closest(".quiz-box").removeClass("bg-dark");
            $(this).closest(".quiz-box").addClass("bg-danger");
        }
        console.log(current_value, correct_anwer);
    });
});
