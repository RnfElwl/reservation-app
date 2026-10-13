package com.bsy.rsv.reservation.controller;

import com.bsy.rsv.reservation.dto.request.JoinRequest;
import com.bsy.rsv.reservation.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class JoinController {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private final UserService userService;
    @PostMapping("/join")
    public ResponseEntity<Boolean> join(@RequestBody JoinRequest request){


        System.out.println(""+ request.email()+""+ request.name());

        userService.joinProcess(request);
        return ResponseEntity.ok(true);
    }
}
