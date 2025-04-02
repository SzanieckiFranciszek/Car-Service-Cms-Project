package com.carservice.carservicecmsbackend.service;

import com.carservice.carservicecmsbackend.dto.ContactInformationDto;
import com.carservice.carservicecmsbackend.model.ContactInformation;
import com.carservice.carservicecmsbackend.repository.ContactInformationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactInformationService {
    private final ContactInformationRepository contactInformationRepository;

    public ContactInformationService(ContactInformationRepository contactInformationRepository) {
        this.contactInformationRepository = contactInformationRepository;
    }

    public List<ContactInformation> getAllContactInformation() {
        return contactInformationRepository.findAll();
    }

    public List<ContactInformation> getAllContactInformationByType(String type) {
        return contactInformationRepository.findAllByTypeIgnoreCase(type);
    }

    public Optional<ContactInformation> getContactInfoById(Long id) {
        return contactInformationRepository.findById(id);
    }

    public ContactInformation createContactInfo(ContactInformation contactInformation) {
        return contactInformationRepository.save(contactInformation);
    }

    public ContactInformation updateContactInfo(Long id, ContactInformationDto contactInformationDto) {
        return contactInformationRepository.findById(id).map(contactInformation -> {
            contactInformation.setValue(contactInformationDto.value());
            contactInformation.setType(contactInformationDto.type());
            contactInformation.setDescription(contactInformationDto.description());
            return contactInformationRepository.save(contactInformation);
        }).orElseThrow(() -> new RuntimeException("Contact Information not found"));
    }

    public void deleteContactInfo(Long id) {
        contactInformationRepository.deleteById(id);
    }

    public List<ContactInformation> getAllContactInformationByDescription(String description) {
        return contactInformationRepository.findAllByDescriptionIgnoreCase(description);

    }
}