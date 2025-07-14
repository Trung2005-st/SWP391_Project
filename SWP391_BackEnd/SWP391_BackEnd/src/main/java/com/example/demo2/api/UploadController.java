package com.example.demo2.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;

@RestController
@CrossOrigin("*")
public class UploadController {

    @PostMapping("/api/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty!");
        }
        try {
            // thư mục ngoài JAR
            String uploadDir = "C:/uploads"; // nếu Linux: "/opt/uploads"

            // tạo tên file an toàn
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // kiểm tra và tạo folder
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // lưu file
            File dest = new File(dir, fileName);
            file.transferTo(dest);

            // trả về đường dẫn public
            String pathForDB = "/image/" + fileName;
            return ResponseEntity.ok(pathForDB);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Upload failed!");
        }
    }
}
