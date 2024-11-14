package com.carservice.car_service_crm_backend.controller;

import com.carservice.car_service_crm_backend.dto.CarDto;
import com.carservice.car_service_crm_backend.model.Car;
import com.carservice.car_service_crm_backend.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/car")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping("/all")
    public List<Car> getAllCars() {
        return carService.findAllCars();
    }

    @GetMapping("/{id}")
    public Optional<Car> getCarById(@PathVariable Long id) {
        return carService.findCarById(id);
    }

    @PostMapping
    public Car createCar(@RequestBody CarDto carDto) {
        return carService.saveCar(carDto);
    }

    @DeleteMapping("/{id}")
    public void deleteCarById(@PathVariable Long id) {
        carService.deleteCar(id);
    }
}
