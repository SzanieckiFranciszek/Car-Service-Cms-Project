package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.OpeningHoursDto;
import com.carservice.carservicecmsbackend.service.OpeningHoursService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opening-hours")
public class OpeningHoursController {

    private final OpeningHoursService openingHoursService;

    public OpeningHoursController(OpeningHoursService openingHoursService) {
        this.openingHoursService = openingHoursService;
    }

    @GetMapping
    public ResponseEntity<List<OpeningHoursDto>> getAllOpeningHours() {
        List<OpeningHoursDto> openingHoursList = openingHoursService.getAllOpeningHours();
        return ResponseEntity.ok(openingHoursList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpeningHoursDto> getOpeningHoursById(@PathVariable Long id) {
        OpeningHoursDto openingHours = openingHoursService.getOpeningHoursById(id);
        return ResponseEntity.ok(openingHours);
    }

    @PostMapping
    public ResponseEntity<OpeningHoursDto> createOpeningHours(@RequestBody OpeningHoursDto openingHoursDto) {
        OpeningHoursDto createdOpeningHours = openingHoursService.createOpeningHours(openingHoursDto);
        return ResponseEntity.ok(createdOpeningHours);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpeningHoursDto> updateOpeningHours(
            @PathVariable Long id,
            @RequestBody OpeningHoursDto openingHoursDto) {
        OpeningHoursDto updatedOpeningHours = openingHoursService.updateOpeningHours(id, openingHoursDto);
        return ResponseEntity.ok(updatedOpeningHours);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOpeningHours(@PathVariable Long id) {
        openingHoursService.deleteOpeningHours(id);
        return ResponseEntity.noContent().build();
    }
}
