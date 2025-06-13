package com.example.demo2;

import com.example.demo2.services.MailSenderService;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.util.Random;

@SpringBootApplication
//setup icon ổ khóa security jwt trong đây
@OpenAPIDefinition(info= @Info(title="User API",version = "1.0", description = "Information"))
@SecurityScheme(name="api", scheme= "bearer", type= SecuritySchemeType.HTTP, in= SecuritySchemeIn.HEADER)
public class Demo2Application {
    @Autowired
    private MailSenderService mailSenderService;
    public static void main(String[] args) {
        SpringApplication.run(Demo2Application.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void sendEmail(){
        mailSenderService.sendEmail("ngthanhtrung302005@gmail.com",
                "This is Trung",
                createRandomPass());;
    }

    public String createRandomPass(){
        Random rand= new Random();
        int num= (100000+(rand.nextInt(999999)));
        String pass= Integer.toString(num);
        return pass;
    }
}
