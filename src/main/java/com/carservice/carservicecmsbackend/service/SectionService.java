package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.SectionDto;
import com.carservice.carservicecmsbackend.model.Page;
import com.carservice.carservicecmsbackend.model.Section;
import com.carservice.carservicecmsbackend.repository.SectionRepository;
import jakarta.transaction.Transactional;
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
        if (sectionRepository.findByOrderIndex(section.getOrderIndex()).isPresent()) {
            shiftOrderIndexesForPage(section.getPage().getId(), section.getOrderIndex(), 1);
        }
        Section savedSection = sectionRepository.save(section);
        return convertToDto(savedSection);
    }

    public SectionDto updateSection(Long id, SectionDto sectionDto) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found with ID: " + id));

        Long currentOrderIndex = section.getOrderIndex();
        Long newOrderIndex = sectionDto.orderIndex();
        if (sectionDto.orderIndex() != null) {
            if (!currentOrderIndex.equals(newOrderIndex)) {
                if (newOrderIndex != null && newOrderIndex <= 0) {
                    throw new IllegalArgumentException("Order index must be greater than 0.");
                }

                if (newOrderIndex > currentOrderIndex) {
                    shiftOrderIndexesForPage(currentOrderIndex + 1, newOrderIndex, -1);
                } else {
                    shiftOrderIndexesForPage(newOrderIndex, currentOrderIndex - 1, 1);
                }

                section.setOrderIndex(sectionDto.orderIndex());
            }
        }

        if (sectionDto.title() != null) {
            section.setTitle(sectionDto.title());
        }
        if (sectionDto.content() != null) {
            section.setContent(sectionDto.content());
        }
        if (sectionDto.isVisible() != null) {
            section.setIsVisible(sectionDto.isVisible());
        }
        if (sectionDto.pageId() != null) {
            Page page = new Page();
            page.setId(sectionDto.pageId());
            section.setPage(page);
        }

        if(sectionDto.showInMenu() != null){
            section.setShowInMenu(sectionDto.showInMenu());
        }
        
        Section updatedSection = sectionRepository.save(section);
        return convertToDto(updatedSection);
    }

    public void deleteSection(Long id) {
        if (!sectionRepository.existsById(id)) {
            throw new RuntimeException("Section not found with ID: " + id);
        }

        Section section = sectionRepository.findById(id)
                .orElseThrow();
        Long pageId = section.getPage().getId();
        Long deletedOrderIndex = section.getOrderIndex();

        sectionRepository.deleteById(id);

        shiftOrderIndexesForPage(pageId,deletedOrderIndex + 1, -1);
    }

    private SectionDto convertToDto(Section section) {
        return SectionDto.builder()
                .id(section.getId())
                .orderIndex(section.getOrderIndex())
                .title(section.getTitle())
                .content(section.getContent())
                .isVisible(section.getIsVisible())
                .showInMenu(section.getShowInMenu())
                .pageId(section.getPage().getId())
                .build();
    }

    private Section convertToEntity(SectionDto sectionDto) {
        Section section = new Section();
        section.setId(sectionDto.id());
        section.setOrderIndex(sectionDto.orderIndex());
        section.setTitle(sectionDto.title());
        section.setContent(sectionDto.content());
        section.setIsVisible(sectionDto.isVisible());
        section.setShowInMenu(sectionDto.showInMenu());

        if (sectionDto.pageId() != null) {
            Page page = new Page();
            page.setId(sectionDto.pageId());
            section.setPage(page);
        }

        return section;
    }

    private void shiftOrderIndexesForPage(Long pageId, Long startIndex, int shift) {
        List<Section> sectionsToShift = sectionRepository.findAllByPageIdAndOrderIndexGreaterThanEqual(pageId, startIndex);

        for (Section section : sectionsToShift) {
            section.setOrderIndex(section.getOrderIndex() + shift);
            sectionRepository.save(section);
        }
    }

    private void shiftOrderIndexesForPage(Long pageId,Long startIndex, Long endIndex, int shift) {
        List<Section> sectionsToShift = sectionRepository.findAllByPageIdOrderByOrderIndexAsc(pageId)
                .stream()
                .filter(section -> section.getOrderIndex() >= startIndex && section.getOrderIndex() <= endIndex)
                .toList();

        for (Section section : sectionsToShift) {
            section.setOrderIndex(section.getOrderIndex() + shift);
            sectionRepository.save(section);
        }
    }

    @Transactional
    public SectionDto updateSectionOrderIndexForPage(Long id, Long newOrderIndex) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found with ID: " + id));

        Long currentOrderIndex = section.getOrderIndex();
        Long pageId = section.getPage().getId();

        if (!currentOrderIndex.equals(newOrderIndex)) {
            if (newOrderIndex <= 0) {
                throw new IllegalArgumentException("Order index must be greater than 0.");
            }


            if (newOrderIndex > currentOrderIndex) {
                shiftOrderIndexesForPage(pageId, currentOrderIndex + 1, newOrderIndex, -1);
            } else {
                shiftOrderIndexesForPage(pageId, newOrderIndex, currentOrderIndex - 1, 1);
            }

            section.setOrderIndex(newOrderIndex);
        }
        sectionRepository.save(section);

        return convertToDto(section);
    }
}