package com.example.demo2.model.request;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaveReasonsRequest {
    private Long userId;
    private List<String> optionCodes;
}
