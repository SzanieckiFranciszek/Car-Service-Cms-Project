package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.OpinionDto;
import com.carservice.carservicecmsbackend.model.Opinion;
import com.carservice.carservicecmsbackend.service.OpinionService;
import jakarta.validation.constraints.Min;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/api/opinions")
public class OpinionController{

    private final OpinionService opinionService;

    public OpinionController(OpinionService opinionService) {
        this.opinionService = opinionService;
    }

    @GetMapping
    public List<OpinionDto> getAllOpinions() {
        return opinionService.getAllOpinions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opinion> getOpinionById(@Min(1) @NotNull @PathVariable Long id) {
        return opinionService.getOpinionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Opinion> createOpinion(@RequestBody OpinionDto opinionDto) {
        Opinion createdOpinion = opinionService.createOpinion(opinionDto);
        return ResponseEntity.ok(createdOpinion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Opinion> updateOpinion(@PathVariable Long id, @RequestBody OpinionDto opinionDto) {
        try {
            Opinion updatedOpinion = opinionService.updateOpinion(id, opinionDto);
            return ResponseEntity.ok(updatedOpinion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOpinion(@PathVariable Long id) {
        opinionService.deleteOpinion(id);
        return ResponseEntity.noContent().build();
    }
}
