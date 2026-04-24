package com.vendly.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResendOtpRequest {

    @NotBlank(message = "Email harus diisi")
    @Email(message = "Format email tidak valid")
    private String email;
}