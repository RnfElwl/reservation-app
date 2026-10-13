package com.bsy.rsv.reservation.global.security;

import io.jsonwebtoken.Jwts;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;


@Component
public class JwtTokenProvider {
    private final SecretKey secretKey;
    private final long accessTokenExpirationMillis;
    private final long refreshTokenExpirationMillis;

    public JwtTokenProvider(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.access-token-expiration-millis}") long accessTokenExpirationMillis,
            @Value("${security.jwt.refresh-token-expiration-millis}") long refreshTokenExpirationMillis
    ){
        this.secretKey = io.jsonwebtoken.security.Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
        this.accessTokenExpirationMillis = accessTokenExpirationMillis;
        this.refreshTokenExpirationMillis = refreshTokenExpirationMillis;

    }

    public String createAccessToken(UUID userId){
        return createToken(
                userId,
                "access",
                accessTokenExpirationMillis
        );
    }

    public String createRefreshToken(UUID userId){
        return createToken(
                userId,
                "refresh",
                refreshTokenExpirationMillis
                );
    }
    private String createToken(UUID userId,String type, long expirationMillis){
        try{

        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("type", type)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public boolean validateToken(String token){
        try{
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;

        }
        catch(Exception e){
            return false;
        }
    }
    public UUID getUserId(String token){
        String subject = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return UUID.fromString(subject);
    }
    public String getTokenType(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("type", String.class);
    }
}
