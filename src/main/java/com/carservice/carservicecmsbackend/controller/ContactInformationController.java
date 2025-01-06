package com.carservice.carservicecmsbackend.controller;

import com.carservice.carservicecmsbackend.dto.ContactInformationDto;
import com.carservice.carservicecmsbackend.model.ContactInformation;
import com.carservice.carservicecmsbackend.service.ContactInformationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact-information")
public class ContactInformationController {

    private final ContactInformationService contactInformationService;

    public ContactInformationController(ContactInformationService contactInformationService) {
        this.contactInformationService = contactInformationService;
    }

    @GetMapping
    public List<ContactInformation> getAllContactInformation() {
        return contactInformationService.getAllContactInformation();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactInformation> getContactInformationById(@PathVariable Long id) {
        return contactInformationService.getContactInfoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<ContactInformation> createContactInformation(@RequestBody ContactInformationDto contactInformationDto) {
        ContactInformation created = contactInformationService.createContactInfo(contactInformationDto.value());
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ContactInformation> updateContactInformation(
            @PathVariable Long id,
            @RequestBody ContactInformationDto contactInformationDto
    ) {
        try {
            ContactInformation updated = contactInformationService.updateContactInfo(id, contactInformationDto.value());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContactInformation(@PathVariable Long id) {
        contactInformationService.deleteContactInfo(id);
        return ResponseEntity.noContent().build();
    }
}
