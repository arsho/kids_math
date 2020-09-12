$(document).ready(function(){

    var valid_operators = {
        "addition": "+",
        "substraction": "-",
        "multiplication": "x",
        "division": "÷"
    };

    var bangla_to_english_mapper = {
        '০': "0",
        '১': "1",
        '২': "2",
        '৩': "3",
        '৪': "4",
        '৫': "5",
        '৬': "6",
        '৭': "7",
        '৮': "8",
        '৯': "9"
    };

    var english_to_bangla_mapper = {
        "0": '০' ,
        "1": '১',
        "2": '২',
        "3": '৩',
        "4": '৪',
        "5": '৫',
        "6": '৬',
        "7": '৭',
        "8": '৮',
        "9": '৯'
    };

    var quiz_data = [];
    var quiz_settings = {};

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

    function get_converted_value(original_value, language_code){
        mapper = "";
        switch (language_code) {
            case "en":
            mapper = bangla_to_english_mapper;
            break;
            default:
            mapper = english_to_bangla_mapper;
        }
        converted_value = [];
        for(i = 0; i < original_value.length; i++){
            character = original_value[i];
            if(mapper.hasOwnProperty(character)){
                converted_value.push(mapper[character]);
            }
            else{
                converted_value.push(character);
            }
        }
        return converted_value.join("");
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

    function get_a_quiz_row(question){
        return `<tr class="quiz_row bg-dark text-white text-center align-items-center">
        <td>
        ${question["operand_1"]}
        </td>
        <td>
        ${question["operator"]}
        </td>
        <td>
        ${question["operand_2"]}
        </td>
        <td>
        =
        </td>
        <td>
        <input id="${question["question_id"]}" class="answer_input form-control" type="text">
        </td>
        <td>
        <button class="btn btn-light"><i class="fa fa-2x fa-share"></i></button>
        </td>
        </tr>`;
        // fa-long-arrow-alt-right
    }

    function get_quiz_settings(){
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
            "max_number_operand_1": $max_number_operand_1,
            "max_number_operand_2": $max_number_operand_2,
            "number_of_questions": $number_of_questions,
            "type_of_questions": $type_of_questions,
            "quiz_language": $quiz_language
        };
    }

    function get_quiz_data(){
        data = [];
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
            if(quiz_settings["quiz_language"] === "bn"){
                question["operand_1"] = operand_1.toLocaleString("bn-BD");
                question["operand_2"] = operand_2.toLocaleString("bn-BD");
            }
            question["operator"] = operator;
            question["question_id"] = i;
            data.push(question);
        }
        return data;
    }

    $("#generate_quiz").on("click", function(){
        quiz_settings = get_quiz_settings();
        $("#quiz_wrapper").removeClass("invisible");
        $("#quiz_settings_box").collapse('hide');
        quiz_data = get_quiz_data();
        $("#quiz_rows").html("");
        for(i = 0; i < quiz_data.length; i++){
            $("#quiz_rows").append(get_a_quiz_row(quiz_data[i]));
        }
    });

    $("body").on("focusout", "input.answer_input", function(event){
        current_value = get_converted_value($(this).val(), "en");
        question_id = parseInt($(this).attr("id"));
        correct_anwer = quiz_data[question_id]["correct_answer"].toString();
        if(current_value === correct_anwer){
            $(this).closest(".quiz_row").removeClass("bg-dark");
            $(this).closest(".quiz_row").removeClass("bg-danger");
            $(this).closest(".quiz_row").addClass("bg-success");
        }
        else{
            $(this).closest(".quiz_row").removeClass("bg-dark");
            $(this).closest(".quiz_row").removeClass("bg-success");
            $(this).closest(".quiz_row").addClass("bg-danger");
        }
    });

    $("body").on("keyup", "input.answer_input", function(event){
        current_value = get_converted_value($(this).val(), "en");
        if(quiz_settings["quiz_language"] === "bn"){
            bangla_value = get_converted_value(current_value, "bn");
            $(this).val(bangla_value);
        }
    });


});
