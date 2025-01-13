package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.HomePageDto;
import com.carservice.carservicecmsbackend.model.HomePage;
import com.carservice.carservicecmsbackend.repository.HomePageRepository;
import org.springframework.stereotype.Service;

@Service
public class HomePageService {
private final HomePageRepository homePageRepository;


    public HomePageService(HomePageRepository homePageRepository) {
        this.homePageRepository = homePageRepository;
    }

    public HomePageDto getHomepage() {
        return homePageRepository.findAll()
                .stream()
                .findFirst()
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Homepage not found!"));
    }

    private HomePageDto convertToDto(HomePage homepage) {
        return HomePageDto.builder()
                .id(homepage.getId())
                .value(homepage.getValue())
                .build();
    }

    public boolean saveOrUpdateHomepage(HomePageDto homePageDto) {
        if (homePageDto != null) {

            HomePage entity = homePageRepository.findAll().stream().findFirst().orElse(new HomePage());
            entity.setId(homePageDto.id());
            entity.setValue(homePageDto.value());
            homePageRepository.save(entity);
            return true;
        }
        return false;
    }
}
