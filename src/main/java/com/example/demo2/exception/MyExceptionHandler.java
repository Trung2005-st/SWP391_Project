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

}

//ORM (Object Relationship Mapping): code trước tạo db cho luôn nên ngược với PRJ
//hồi PRJ => tạo db viết db trước mới code và connect