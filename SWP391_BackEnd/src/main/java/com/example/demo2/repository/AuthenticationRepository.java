package com.example.demo2.repository;

import com.example.demo2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
//dùng jparepository với account và khóa để tưj có sẵn các crud trong db
public interface AuthenticationRepository extends JpaRepository<User, Long> {
    //có thể định nghĩa methods cho repository -> bắt buộc phía sau by phải ghi đúng tên biến và find phải đúng model
    User findUserByUsername(String username);
}
