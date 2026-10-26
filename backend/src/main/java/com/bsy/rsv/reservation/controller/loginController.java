package com.bsy.rsv.reservation.controller;


import com.bsy.rsv.reservation.dto.request.LoginRequest;
import com.bsy.rsv.reservation.dto.response.LoginResponse;
import com.bsy.rsv.reservation.dto.response.LoginResult;
import com.bsy.rsv.reservation.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
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
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ) {

        String accessToken = userService.reissueAccessToken(refreshToken);

        return ResponseEntity.ok(new LoginResponse(accessToken));
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Boolean> logout(
            @CookieValue("refreshToken") String refreshToken
            , HttpServletResponse response
            ){
        System.out.println("------------------------------------");
        Boolean logoutCheck = userService.logoutToken(refreshToken);
        System.out.println("111111111111111111111111111");
        ResponseCookie cookie = ResponseCookie
                .from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(logoutCheck);
    }
}
