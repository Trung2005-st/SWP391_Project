package com.example.demo2.model.request;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaveTriggersRequest {
    private Long userId;
    private List<String> triggerCodes;
}
