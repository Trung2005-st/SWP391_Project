package com.example.demo2.model.request;

import com.example.demo2.enums.Gender;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private Gender gender;
    // nếu muốn đổi mật khẩu thì bắt buộc nhập đủ
    private String oldPassword;
    private String newPassword;
    // cái email khó mà update đc vì nó cần phải verify lại lần nữa, khá là mất công sức
    // hiện giờ chưa có thng tin gì đáng để mà update cả, nếu có thông tin cần update thì thêm vô
}
