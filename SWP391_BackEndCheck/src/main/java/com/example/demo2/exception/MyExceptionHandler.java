package com.example.demo2.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MyExceptionHandler {

    //định nghĩa chạy mỗi khi gặp exception

    //MethodArgumentNotValidException: lỗi nhập sai
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleValidationException(MethodArgumentNotValidException ex) {
        String message= "";

        //mỗi thuộc tính lỗi => gán biến vào message
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            //name, code, score
            message += fieldError.getField() + ": "+fieldError.getDefaultMessage();
        }
        return new ResponseEntity(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity handleNotFoundException(NotFoundException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MembershipPlanNotFoundException.class)
    public ResponseEntity handleMembershipPlanNotFoundException(MembershipPlanNotFoundException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BlogDetailNotFoundException.class)
    public ResponseEntity handleBlogDetailNotFoundException(BlogDetailNotFoundException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CoachProfileNotFoundException.class)
    public ResponseEntity handleCoachProfileNotFoundException(CoachProfileNotFoundException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity handleBadRequestException(BadRequestException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(InvalidMembershipException.class)
    public ResponseEntity handleInvalidMembershipException(InvalidMembershipException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity handleAccountNotFoundException(AccountNotFoundException ex) {
        return new ResponseEntity(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}

//ORM (Object Relationship Mapping): code trước tạo db cho luôn nên ngược với PRJ
//hồi PRJ => tạo db viết db trước mới code và connect