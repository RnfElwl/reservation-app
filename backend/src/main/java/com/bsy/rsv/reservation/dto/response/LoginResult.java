package com.bsy.rsv.reservation.dto.response;

public record LoginResult (
        String accessToken,
        String refreshToken
){
}
