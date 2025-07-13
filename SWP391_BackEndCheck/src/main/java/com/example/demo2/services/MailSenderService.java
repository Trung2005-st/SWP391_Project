package com.example.demo2.services;

import com.example.demo2.dto.EmailDetail;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class MailSenderService {

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private JavaMailSender javaMailSender;


    public void  sendMail(EmailDetail emailDetail){

        try{

            Context context = new Context();

            context.setVariable("name", emailDetail.getRecipient());
            context.setVariable("link", emailDetail.getLink());
            context.setVariable("button", "Reset Password"); // assuming your template has [[${button}]]


            String html = templateEngine.process("emailtemplate",context);

            // Creating a simple mail message
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

            // Setting up necessary details
            mimeMessageHelper.setFrom("dangkhoa1232001@gmail.com");
            mimeMessageHelper.setTo(emailDetail.getRecipient());
            mimeMessageHelper.setSubject(emailDetail.getSubject());
            mimeMessageHelper.setText(html, true);

            javaMailSender.send(mimeMessage);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

}
