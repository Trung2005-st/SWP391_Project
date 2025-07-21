
package com.example.demo2.model.request;

import lombok.Data;

import java.util.List;

@Data
public class SaveReasonsByCodeRequest {
    private Long userId;
    private List<String> optionCodes;
}
