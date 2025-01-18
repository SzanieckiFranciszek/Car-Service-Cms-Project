package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.SectionDto;
import com.carservice.carservicecmsbackend.service.SectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/section")
public class SectionController {

    private final SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }

    @GetMapping
    public ResponseEntity<List<SectionDto>> getAllSections() {
        List<SectionDto> sections = sectionService.getAllSections();
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionDto> getSectionById(@PathVariable Long id) {
        SectionDto section = sectionService.getSectionById(id);
        return ResponseEntity.ok(section);
    }

    @PostMapping("/create")
    public ResponseEntity<SectionDto> createSection(@RequestBody SectionDto sectionDto) {
        SectionDto createdSection = sectionService.createSection(sectionDto);
        return ResponseEntity.ok(createdSection);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SectionDto> updateSection(
            @PathVariable Long id,
            @RequestBody SectionDto sectionDto) {
        SectionDto updatedSection = sectionService.updateSection(id, sectionDto);
        return ResponseEntity.ok(updatedSection);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
