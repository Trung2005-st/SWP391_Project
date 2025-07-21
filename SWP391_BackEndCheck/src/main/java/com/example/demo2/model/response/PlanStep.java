package com.example.demo2.model.response;

public class PlanStep {
    private Integer order;
    private String content;

    public PlanStep(Integer order, String content) {
        this.order = order;
        this.content = content;
    }
    public Integer getOrder() { return order; }
    public String getContent() { return content; }
}
