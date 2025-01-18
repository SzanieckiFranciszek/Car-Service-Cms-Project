package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.SectionDto;
import com.carservice.carservicecmsbackend.model.Page;
import com.carservice.carservicecmsbackend.model.Section;
import com.carservice.carservicecmsbackend.repository.SectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SectionService {
    private final SectionRepository sectionRepository;

    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    public List<SectionDto> getAllSections() {
        return sectionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public SectionDto getSectionById(Long id) {
        return sectionRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Section not found with ID: " + id));
    }

    public SectionDto createSection(SectionDto sectionDto) {
        Section section = convertToEntity(sectionDto);
        Section savedSection = sectionRepository.save(section);
        return convertToDto(savedSection);
    }

    public SectionDto updateSection(Long id, SectionDto sectionDto) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found with ID: " + id));

        section.setOrderIndexOnPage(sectionDto.orderIndexOnPage());
        section.setTitle(sectionDto.title());
        section.setContent(sectionDto.content());
        section.setIsVisible(sectionDto.isVisible());

        if (sectionDto.pageId() != null) {
            Page page = new Page();
            page.setId(sectionDto.pageId());
            section.setPage(page);
        }
        Section updatedSection = sectionRepository.save(section);
        return convertToDto(updatedSection);
    }

    public void deleteSection(Long id) {
        if (!sectionRepository.existsById(id)) {
            throw new RuntimeException("Section not found with ID: " + id);
        }
        sectionRepository.deleteById(id);
    }

    private SectionDto convertToDto(Section section) {
        return SectionDto.builder()
                .id(section.getId())
                .orderIndexOnPage(section.getOrderIndexOnPage())
                .title(section.getTitle())
                .content(section.getContent())
                .isVisible(section.getIsVisible())
                .pageId(section.getPage().getId())
                .build();
    }

    private Section convertToEntity(SectionDto sectionDto) {
        Section section = new Section();
        section.setId(sectionDto.id());
        section.setOrderIndexOnPage(sectionDto.orderIndexOnPage());
        section.setTitle(sectionDto.title());
        section.setContent(sectionDto.content());
        section.setIsVisible(sectionDto.isVisible());

        if (sectionDto.pageId() != null) {
            Page page = new Page();
            page.setId(sectionDto.pageId());
            section.setPage(page);
        }

        return section;
    }

}