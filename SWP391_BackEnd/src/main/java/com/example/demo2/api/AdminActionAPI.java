package com.example.demo2.api;

import com.example.demo2.entity.AdminAction;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
public class AdminActionAPI {

    List<AdminAction> adminList= new ArrayList<AdminAction>();

    @GetMapping("/api/admin")
    public ResponseEntity getAdminActionList(){
        return ResponseEntity.ok(adminList);
    }

    @GetMapping("/api/admin/actionId")
    public ResponseEntity getAdminActionById(@RequestParam int id){
        return ResponseEntity.ok(adminList.get(id));
    }

}
