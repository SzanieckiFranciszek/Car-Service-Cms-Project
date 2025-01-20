package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.PageDetailsDto;
import com.carservice.carservicecmsbackend.dto.PageDto;
import com.carservice.carservicecmsbackend.dto.PageSectionDto;
import com.carservice.carservicecmsbackend.dto.SectionDto;
import com.carservice.carservicecmsbackend.model.Page;
import com.carservice.carservicecmsbackend.model.Section;
import com.carservice.carservicecmsbackend.repository.PageRepository;
import jakarta.transaction.Transactional;
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

    @Transactional
    public PageSectionDto savePage(PageSectionDto dto) {
        Page page = convertToEntityWithSection(dto);

        if (pageRepository.findByOrderIndex(page.getOrderIndex()).isPresent()) {
            shiftOrderIndexes(page.getOrderIndex(), 1);
        }

        Page savedPage = pageRepository.save(page);
        return convertToDtoWithSection(savedPage);
    }

    @Transactional
    public PageSectionDto updatePage(Long id, PageSectionDto pageDto) {
        Page page = pageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Page not found with ID: " + id));

        Long currentOrderIndex = page.getOrderIndex();
        Long newOrderIndex = pageDto.orderIndex();

        if (!currentOrderIndex.equals(newOrderIndex)) {
            if (newOrderIndex != null && newOrderIndex <= 0) {
                throw new IllegalArgumentException("Order index must be greater than 0.");
            }


            if (newOrderIndex > currentOrderIndex) {
                shiftOrderIndexes(currentOrderIndex + 1, newOrderIndex, -1);
            } else {
                shiftOrderIndexes(newOrderIndex, currentOrderIndex - 1, 1);
            }
            page.setOrderIndex(pageDto.orderIndex());
        }

        page.setName(pageDto.name());
        if (pageDto.section()!=null) {
            page.setSections(pageDto.section());
        }
        page.setIsHomepage(pageDto.isHomepage());
        page.setIsVisible(pageDto.isVisible());
        page.setIsRemovable(pageDto.isRemovable());
        page.setIsGallery(pageDto.isGallery());

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
                .isGallery(page.getIsGallery())
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
                .isGallery(page.getIsGallery())
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
        page.setIsGallery(dto.isGallery());
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
        page.setIsGallery(dto.isGallery());
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
                .orderIndex(section.getOrderIndex())
                .title(section.getTitle())
                .content(section.getContent())
                .isVisible(section.getIsVisible())
                .showInMenu(section.getShowInMenu())
                .build();
    }

    private Section convertDtoToSection(SectionDto sectionDto) {
        Section section = new Section();
        section.setId(sectionDto.id());
        section.setOrderIndex(sectionDto.orderIndex());
        section.setTitle(sectionDto.title());
        section.setContent(sectionDto.content());
        section.setIsVisible(sectionDto.isVisible());
        section.setShowInMenu(sectionDto.showInMenu());
        return section;
    }

    @Transactional
    public void deletePage(Long id) {
        if (!pageRepository.existsById(id)) {
            throw new RuntimeException("Page not found with ID: " + id);
        }
        Page page = pageRepository.findById(id).orElseThrow();

        Long deletedOrderIndex = page.getOrderIndex();
        pageRepository.deleteById(id);

        shiftOrderIndexes(deletedOrderIndex + 1, -1);
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

    private void shiftOrderIndexes(Long startIndex, int shift) {
        List<Page> pagesToShift = pageRepository.findByOrderIndexGreaterThanEqual(startIndex);

        for (Page page : pagesToShift) {
            page.setOrderIndex(page.getOrderIndex() + shift);
            pageRepository.save(page);
        }
    }

    private void shiftOrderIndexes(Long startIndex, Long endIndex, int shift) {
        List<Page> pagesToShift = pageRepository.findAllByOrderByOrderIndexAsc()
                .stream()
                .filter(page -> page.getOrderIndex() >= startIndex && page.getOrderIndex() <= endIndex)
                .toList();

        for (Page page : pagesToShift) {
            page.setOrderIndex(page.getOrderIndex() + shift);
            pageRepository.save(page);
        }
    }

    @Transactional
    public PageSectionDto updatePageOrderIndex(Long id, Long newOrderIndex) {
        Page page = pageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Page not found with ID: " + id));

        Long currentOrderIndex = page.getOrderIndex();

        if (!currentOrderIndex.equals(newOrderIndex)) {
            if (newOrderIndex <= 0) {
                throw new IllegalArgumentException("Order index must be greater than 0.");
            }

            if (newOrderIndex > currentOrderIndex) {
                shiftOrderIndexes(currentOrderIndex + 1, newOrderIndex, -1);
            } else {
                shiftOrderIndexes(newOrderIndex, currentOrderIndex - 1, 1);
            }

            page.setOrderIndex(newOrderIndex);
        }

        pageRepository.save(page);

        return convertToDtoWithSection(page);
    }
}
