$(document).ready(function(){
    $("#generate_quiz").on("click", function(){
        $student_name = $("#student_name").val();
        $max_number = parseInt($("#max_number").val());
        if(!$max_number){
            $max_number = 30;
        }
        $number_of_questions = $("#number_of_questions").val();
        $type_of_questions = $("#type_of_questions").val();
        if($type_of_questions.length === 0){
            $type_of_questions = ["random"];
        }
        
    });
});
