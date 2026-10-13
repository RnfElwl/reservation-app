package com.bsy.rsv.reservation.dto.request;


public record JoinRequest (
        String name,
        String email,
        String password,
        String passwordCheck
){}
