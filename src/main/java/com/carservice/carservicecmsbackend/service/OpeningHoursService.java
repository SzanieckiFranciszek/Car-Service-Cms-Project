package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.OpeningHoursDto;
import com.carservice.carservicecmsbackend.model.OpeningHours;
import com.carservice.carservicecmsbackend.repository.OpeningHoursRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OpeningHoursService {

    private final OpeningHoursRepository openingHoursRepository;

    public OpeningHoursService(OpeningHoursRepository openingHoursRepository) {
        this.openingHoursRepository = openingHoursRepository;
    }

    public List<OpeningHoursDto> getAllOpeningHours() {
        return openingHoursRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OpeningHoursDto getOpeningHoursById(Long id) {
        return openingHoursRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Opening hours not found with ID: " + id));
    }

    public OpeningHoursDto createOpeningHours(OpeningHoursDto openingHoursDto) {
        OpeningHours openingHours = convertToEntity(openingHoursDto);
        OpeningHours savedOpeningHours = openingHoursRepository.save(openingHours);
        return convertToDto(savedOpeningHours);
    }

    public OpeningHoursDto updateOpeningHours(Long id, OpeningHoursDto openingHoursDto) {
        OpeningHours openingHours = openingHoursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opening hours not found with ID: " + id));

        openingHours.setDayFrom(openingHoursDto.dayFrom());
        openingHours.setDayTo(openingHoursDto.dayTo());
        openingHours.setTimeFrom(openingHoursDto.timeFrom());
        openingHours.setTimeTo(openingHoursDto.timeTo());

        OpeningHours updatedOpeningHours = openingHoursRepository.save(openingHours);
        return convertToDto(updatedOpeningHours);
    }

    public void deleteOpeningHours(Long id) {
        if (!openingHoursRepository.existsById(id)) {
            throw new RuntimeException("Opening hours not found with ID: " + id);
        }
        openingHoursRepository.deleteById(id);
    }

    private OpeningHoursDto convertToDto(OpeningHours openingHours) {
        return OpeningHoursDto.builder()
                .id(openingHours.getId())
                .dayFrom(openingHours.getDayFrom())
                .dayTo(openingHours.getDayTo())
                .timeFrom(openingHours.getTimeFrom())
                .timeTo(openingHours.getTimeTo())
                .build();
    }

    private OpeningHours convertToEntity(OpeningHoursDto openingHoursDto) {
        OpeningHours openingHours = new OpeningHours();
        openingHours.setId(openingHoursDto.id());
        openingHours.setDayFrom(openingHoursDto.dayFrom());
        openingHours.setDayTo(openingHoursDto.dayTo());
        openingHours.setTimeFrom(openingHoursDto.timeFrom());
        openingHours.setTimeTo(openingHoursDto.timeTo());
        return openingHours;
    }
}