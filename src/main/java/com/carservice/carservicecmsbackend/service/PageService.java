package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.PageDetailsDto;
import com.carservice.carservicecmsbackend.dto.PageDto;
import com.carservice.carservicecmsbackend.dto.PageSectionDto;
import com.carservice.carservicecmsbackend.dto.SectionDto;
import com.carservice.carservicecmsbackend.model.Page;
import com.carservice.carservicecmsbackend.model.Section;
import com.carservice.carservicecmsbackend.repository.PageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PageService {
    private final PageRepository pageRepository;

    public PageService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    public List<PageDto> getAllVisiblePages() {
        return pageRepository.findAllByIsVisibleTrueOrderByOrderIndexAsc()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<PageDetailsDto> getAllVisiblePagesDetails() {
        return pageRepository.findAllByIsVisibleTrueOrderByOrderIndexAsc()
                .stream()
                .map(this::convertToDtoWithOnlyDetails)
                .toList();
    }

    public PageSectionDto getPageById(Long id) {
        return pageRepository.findById(id)
                .map(this::convertToDtoWithSection)
                .orElseThrow(() -> new RuntimeException("Page not found!"));
    }

    public PageSectionDto savePage(PageSectionDto dto) {
        Page page = convertToEntityWithSection(dto);
        Page savedPage = pageRepository.save(page);
        return convertToDtoWithSection(savedPage);
    }

    public PageSectionDto updatePage(Long id, PageSectionDto pageDto) {
        Page page = pageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Page not found with ID: " + id));

        page.setOrderIndex(pageDto.orderIndex());
        page.setName(pageDto.name());
        if (pageDto.section()!=null) {
            page.setSections(pageDto.section());
        }
        page.setIsHomepage(pageDto.isHomepage());
        page.setIsVisible(pageDto.isVisible());
        page.setIsRemovable(pageDto.isRemovable());

        Page updatedPage = pageRepository.save(page);
        return convertToDtoWithSection(updatedPage);
    }

    private PageDto convertToDto(Page page) {
        return PageDto.builder()
                .id(page.getId())
                .orderIndex(page.getOrderIndex())
                .name(page.getName())
                .isHomepage(page.getIsHomepage())
                .isVisible(page.getIsVisible())
                .isRemovable(page.getIsRemovable())
                .build();
    }

    private PageSectionDto convertToDtoWithSection(Page page) {
        return PageSectionDto.builder()
                .id(page.getId())
                .orderIndex(page.getOrderIndex())
                .name(page.getName())
                .isHomepage(page.getIsHomepage())
                .isVisible(page.getIsVisible())
                .section(page.getSections())
                .isRemovable(page.getIsRemovable())
                .build();
    }

    private PageDetailsDto convertToDtoWithOnlyDetails(Page page) {
        return PageDetailsDto.builder()
                .id(page.getId())
                .name(page.getName())
                .orderIndex(page.getOrderIndex())
                .isVisible(page.getIsVisible())
                .build();
    }

    private Page convertToEntity(PageDto dto) {
        Page page = new Page();
        page.setId(dto.id());
        page.setOrderIndex(dto.orderIndex());
        page.setName(dto.name());
        page.setIsHomepage(dto.isHomepage());
        page.setIsVisible(dto.isVisible());
        page.setIsRemovable(dto.isRemovable());
        return page;
    }

    private Page convertToEntityWithSection(PageSectionDto dto) {
        Page page = new Page();
        page.setId(dto.id());
        page.setOrderIndex(dto.orderIndex());
        page.setName(dto.name());
        page.setIsHomepage(dto.isHomepage());
        page.setIsVisible(dto.isVisible());
        page.setSections(dto.section());
        page.setIsRemovable(dto.isRemovable());
        return page;
    }

    public List<PageDto> getAllPages() {
        return pageRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<PageDetailsDto> getAllPagesDetails() {
        return pageRepository.findAll()
                .stream()
                .map(this::convertToDtoWithOnlyDetails)
                .toList();
    }

    private SectionDto convertSectionToDto(Section section) {
        return SectionDto.builder()
                .id(section.getId())
                .orderIndexOnPage(section.getOrderIndexOnPage())
                .title(section.getTitle())
                .content(section.getContent())
                .isVisible(section.getIsVisible())
                .showInMenu(section.getShowInMenu())
                .build();
    }

    private Section convertDtoToSection(SectionDto sectionDto) {
        Section section = new Section();
        section.setId(sectionDto.id());
        section.setOrderIndexOnPage(sectionDto.orderIndexOnPage());
        section.setTitle(sectionDto.title());
        section.setContent(sectionDto.content());
        section.setIsVisible(sectionDto.isVisible());
        section.setShowInMenu(sectionDto.showInMenu());
        return section;
    }


    public void deletePage(Long id) {
        if (!pageRepository.existsById(id)) {
            throw new RuntimeException("Page not found with ID: " + id);
        }
        pageRepository.deleteById(id);
    }

    public List<PageSectionDto> getAllPagesWithSection() {
        return pageRepository.findAll()
                .stream()
                .map(this::convertToDtoWithSection)
                .toList();
    }

    public List<PageSectionDto> getAllVisiblePagesWithSection() {
        return pageRepository.findAllByIsVisibleTrueOrderByOrderIndexAsc()
                .stream()
                .map(this::convertToDtoWithSection)
                .toList();
    }

//    public List<PageSectionDto> getAllPagesWithSectionForShowInMenu() {
//        return pageRepository.findAll()
//                .stream()
//                .map(this::convertToDtoWithSection)
//                .toList();
//    }
}
