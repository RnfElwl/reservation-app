package com.bsy.rsv.reservation.service;


import com.bsy.rsv.reservation.dto.request.JoinRequest;
import com.bsy.rsv.reservation.dto.request.LoginRequest;
import com.bsy.rsv.reservation.dto.response.LoginResult;
import com.bsy.rsv.reservation.entity.RefreshToken;
import com.bsy.rsv.reservation.entity.UserEntity;
import com.bsy.rsv.reservation.global.security.JwtTokenProvider;
import com.bsy.rsv.reservation.repository.TokenRepository;
import com.bsy.rsv.reservation.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public void joinProcess(JoinRequest request){
        String ChangePsw = bCryptPasswordEncoder.encode(request.password());

        UserEntity user = new UserEntity(request.email(), ChangePsw, request.name(), "USER", "LOCAL", "ACTIVE");

        userRepository.save(user);
    }

    public LoginResult loginProcess(LoginRequest request){

        UserEntity user= userRepository
                .findByEmail(request.email())
                .orElseThrow(()->
                        new RuntimeException("사용자를 찾을수 없습니다"));

        if(!bCryptPasswordEncoder.matches(request.psw(), user.getPassword())){
            throw new RuntimeException("비밀번호가 일치하지 않습니다");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getId());

        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());
        System.out.println("111111111111111111111111111111111111111111111");
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(30);

        RefreshToken token = new RefreshToken(
                user.getId(),
                refreshToken,
                expiresAt
        );
        tokenRepository.save(token);



        return new LoginResult( accessToken, refreshToken);
    }
}
