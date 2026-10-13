package com.bsy.rsv.reservation.controller;


import com.bsy.rsv.reservation.dto.request.LoginRequest;
import com.bsy.rsv.reservation.dto.response.LoginResponse;
import com.bsy.rsv.reservation.dto.response.LoginResult;
import com.bsy.rsv.reservation.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
public class loginController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResult result = userService.loginProcess(request);

        ResponseCookie refreshCookie =
                ResponseCookie.from(
                        "refreshToken",
                        result.refreshToken()
                )
                .httpOnly(true)
                .secure(false) // 로컬 HTTP 개발용. 운영 HTTPS 환경에서는 true
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofDays(30))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new LoginResponse(result.accessToken()));
    }
    @PostMapping("/reissue")
    public ResponseEntity<LoginResponse> reissue(
            @CookieValue("refreshToken") String refreshToken
    ) {
        // 유효성 검사
        // DB 저장 여부 확인
        // 새 Access Token 생성
        // 응답
        return ResponseEntity.ok(new LoginResponse("test"));
    }
}
