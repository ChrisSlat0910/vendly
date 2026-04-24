package com.vendly.backend.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Username harus diisi")
    @Size(min = 3, max = 50, message = "Username 3-50 karakter")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username hanya boleh huruf, angka, dan underscore")
    private String username;

    @NotBlank(message = "Email harus diisi")
    @Email(message = "Format email tidak valid")
    @Size(max = 255)
    private String email;

    @NotBlank(message = "Password harus diisi")
    @Size(min = 8, max = 72, message = "Password minimal 8 karakter")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Password harus mengandung huruf besar, huruf kecil, dan angka")
    private String password;

    @Size(max = 100)
    private String displayName;
}