package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.PageDetailsDto;
import com.carservice.carservicecmsbackend.dto.PageDto;
import com.carservice.carservicecmsbackend.dto.PageSectionDto;
import com.carservice.carservicecmsbackend.service.PageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
public class PageController {
    private final PageService pageService;

    public PageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping
    public List<PageDto> getAllPages() {
        return pageService.getAllPages();
    }

    @GetMapping("/section")
    public List<PageSectionDto> getAllPagesWithSection() {
        return pageService.getAllPagesWithSection();
    }

//    @GetMapping("/section/menu")
//    public List<PageSectionDto> getAllPagesWithSectionForShowInMenu() {
//        return pageService.getAllPagesWithSectionForShowInMenu();
//    }

    @GetMapping("/details")
    public List<PageDetailsDto> getAllPagesDetails() {
        return pageService.getAllPagesDetails();
    }

    @GetMapping("/visible")
    public List<PageDto> getAllVisiblePages() {
        return pageService.getAllVisiblePages();
    }

    @GetMapping("/visible/section")
    public List<PageSectionDto> getAllVisiblePagesWithSection() {
        return pageService.getAllVisiblePagesWithSection();
    }


    @GetMapping("/visible/details")
    public List<PageDetailsDto> getAllVisiblePagesDetails() {
        return pageService.getAllVisiblePagesDetails();
    }

    @GetMapping("/{id}")
    public PageSectionDto getPageById(@PathVariable Long id) {
        return pageService.getPageById(id);
    }

    @PostMapping("/create")
    public PageSectionDto createPage(@RequestBody PageSectionDto pageSectionDto) {
        return pageService.savePage(pageSectionDto);
    }

    @PatchMapping("/update/{id}")
    public PageSectionDto updatePageById(@PathVariable Long id, @RequestBody PageSectionDto pageDto) {
        return pageService.updatePage(id,pageDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePageById(@PathVariable Long id) {
        pageService.deletePage(id);
        return ResponseEntity.noContent().build();
    }
}
