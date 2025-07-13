package com.example.demo2.model.request;


import com.example.demo2.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class registerRequest {
    @NotBlank
    @Size(min = 3, max = 30)
    private String username;

    @Email
    @NotBlank
    private String email;

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[A-Z]).{8,}$")
    private String password;
}
