package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.PageDetailsDto;
import com.carservice.carservicecmsbackend.dto.PageDto;
import com.carservice.carservicecmsbackend.model.Page;
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

    public PageDto getPageById(Long id) {
        return pageRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Page not found!"));
    }

    public PageDto savePage(PageDto dto) {
        Page page = convertToEntity(dto);
        Page savedPage = pageRepository.save(page);
        return convertToDto(savedPage);
    }

    private PageDto convertToDto(Page page) {
        return PageDto.builder()
                .id(page.getId())
                .orderIndex(page.getOrderIndex())
                .name(page.getName())
                .title(page.getTitle())
                .childPage(page.getChildPage() !=null ? page.getChildPage() : null)
                .isHomepage(page.getIsHomepage())
                .isVisible(page.getIsVisible())
                .content(page.getContent())
                .isRemovable(page.getIsRemovable())
                .build();
    }

    private PageDetailsDto convertToDtoWithOnlyDetails(Page page) {
        return PageDetailsDto.builder()
                .id(page.getId())
                .orderIndex(page.getOrderIndex())
                .title(page.getTitle())
                .isVisible(page.getIsVisible())
                .build();
    }

    private Page convertToEntity(PageDto dto) {
        Page page = new Page();
        page.setId(dto.id());
        page.setOrderIndex(dto.orderIndex());
        page.setName(dto.name());
        page.setTitle(dto.title());
        page.setChildPage(dto.childPage() != null ? dto.childPage():null);
        page.setIsHomepage(dto.isHomepage());
        page.setIsVisible(dto.isVisible());
        page.setContent(dto.content());
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
}
