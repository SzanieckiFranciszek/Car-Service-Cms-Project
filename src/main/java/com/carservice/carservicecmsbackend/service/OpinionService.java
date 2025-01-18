package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.OpinionDto;
import com.carservice.carservicecmsbackend.model.Opinion;
import com.carservice.carservicecmsbackend.model.User;
import com.carservice.carservicecmsbackend.repository.OpinionRepository;
import com.carservice.carservicecmsbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OpinionService {

    private final OpinionRepository opinionRepository;
    private final UserRepository userRepository;

    public OpinionService(OpinionRepository opinionRepository, UserRepository userRepository) {
        this.opinionRepository = opinionRepository;
        this.userRepository = userRepository;
    }

    public List<OpinionDto> getAllOpinions() {
        return opinionRepository.findAll()
                .stream()
                .map(opinion -> OpinionDto.builder()
                        .id(opinion.getId())
                        .content(opinion.getContent())
                        .user(opinion.getUserOpinionDto())
                        .createdAt(opinion.getCreatedAt())
                        .build())
                .toList();
    }

    public Optional<Opinion> getOpinionById(Long id) {
        return opinionRepository.findById(id);
    }

    public Opinion createOpinion(OpinionDto opinionDto) {
        Opinion opinion = new Opinion();
        opinion.setContent(opinionDto.content());
        User user = findUserById(opinionDto.user().id());

        opinion.setUser(user);
        return opinionRepository.save(opinion);
    }

    public Opinion updateOpinion(Long id, OpinionDto opinionDto) {
        return opinionRepository.findById(id).map(opinion -> {
           opinion.setContent(opinionDto.content());

           User user = findUserById(opinionDto.id());
           opinion.setUser(user);

           return opinionRepository.save(opinion);
        }).orElseThrow(() -> new RuntimeException("Opinion not found"));
    }

    public void deleteOpinion(Long id) {
        opinionRepository.deleteById(id);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }
}
