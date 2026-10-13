package com.bsy.rsv.reservation.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name= "users")
@Getter
@NoArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = false)
    private String email;
    @Column(nullable = false, unique = false)
    private String password;


    @Column(nullable = true, unique = false)
    private String name;

    @Column(nullable = false)
    private String role;
    @Column(nullable = false)
    private String provider;
    private String provider_id;
    @Column(nullable = false)
    private String status;
    @Column( insertable = false, updatable = false)
    private LocalDateTime created_at;
    @Column( insertable = false, updatable = false)
    private LocalDateTime updated_at;

    public UserEntity(String email, String password, String name, String role, String provider, String status){
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.provider = provider;
        this.status = status;
    }
}
