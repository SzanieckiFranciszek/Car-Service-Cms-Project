package com.carservice.car_service_crm_backend.service;

import com.carservice.car_service_crm_backend.dto.CarDto;
import com.carservice.car_service_crm_backend.model.Car;
import com.carservice.car_service_crm_backend.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<Car> findAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> findCarById(Long id) {
        return carRepository.findById(id);
    }

    public Car saveCar(CarDto carDto) {
        Car car = new Car();
        car.setMark(carDto.mark());
        car.setModel(carDto.model());
        car.setProductionYear(carDto.productionYear());
        car.setLicensePlate(carDto.licensePlate());

        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}