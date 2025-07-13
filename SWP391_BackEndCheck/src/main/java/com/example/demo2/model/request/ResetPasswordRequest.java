package com.example.demo2.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResetPasswordRequest {

    /** Token tạm được backend cấp sau khi OTP hợp lệ */
    @NotBlank(message = "Reset token is required")
    private String resetToken;

    /** Mật khẩu mới: ≥8 ký tự, có số & chữ hoa */
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[A-Z]).{8,}$",
            message = "Password must contain at least one number, one uppercase letter, and be at least 8 characters long"
    )
    private String password;
}
