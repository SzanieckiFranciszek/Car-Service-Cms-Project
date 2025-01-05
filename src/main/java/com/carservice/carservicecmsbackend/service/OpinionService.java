package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.OpinionDto;
import com.carservice.carservicecmsbackend.model.Opinion;
import com.carservice.carservicecmsbackend.repository.OpinionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OpinionService {

    private final OpinionRepository opinionRepository;

    public OpinionService(OpinionRepository opinionRepository) {
        this.opinionRepository = opinionRepository;
    }

    public List<Opinion> getAllOpinions() {
        return opinionRepository.findAll();
    }

    public Optional<Opinion> getOpinionById(Long id) {
        return opinionRepository.findById(id);
    }

    public Opinion createOpinion(OpinionDto opinionDto) {
        Opinion opinion = new Opinion();
        opinion.setContent(opinionDto.content());
        opinion.setUser(opinionDto.user());
        return opinionRepository.save(opinion);
    }

    public Opinion updateOpinion(Long id, OpinionDto opinionDto) {
        return opinionRepository.findById(id).map(opinion -> {
            opinion.setUser(opinionDto.user());
            opinion.setContent(opinionDto.content());
            return opinionRepository.save(opinion);
        }).orElseThrow(() -> new RuntimeException("Opinion not found"));
    }

    public void deleteOpinion(Long id) {
        opinionRepository.deleteById(id);
    }
}
