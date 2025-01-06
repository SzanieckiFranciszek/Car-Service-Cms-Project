package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.HomePageDto;
import com.carservice.carservicecmsbackend.service.HomePageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/homepage")
public class HomePageController {
    private final HomePageService homePageService;

    public HomePageController(HomePageService homePageService) {
        this.homePageService = homePageService;
    }

    @GetMapping
    public HomePageDto getHomepage() {
        return homePageService.getHomepage();
    }
}
