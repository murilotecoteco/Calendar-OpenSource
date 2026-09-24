package br.com.calendar.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryUpdateDTO(
        @NotBlank(message = "Title is required.")
        String title,
        String color,
        String icon) {
}