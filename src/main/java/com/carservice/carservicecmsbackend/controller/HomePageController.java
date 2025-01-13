package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.HomePageDto;
import com.carservice.carservicecmsbackend.service.HomePageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping()
    public ResponseEntity<String> updateHomepage(@RequestBody HomePageDto homePageDto) {
        boolean isSaved = homePageService.saveOrUpdateHomepage(homePageDto);
        if (isSaved) {
            return ResponseEntity.ok("Homepage saved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to save homepage.");
        }
    }
}
