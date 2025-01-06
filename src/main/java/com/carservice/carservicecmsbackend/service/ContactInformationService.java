package com.carservice.carservicecmsbackend.service;

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
        return contactInformationRepository.findByType(type);
    }


    public Optional<ContactInformation> getContactInfoById(Long id) {
        return contactInformationRepository.findById(id);
    }

    public ContactInformation createContactInfo(String value) {
        ContactInformation contactInformation = new ContactInformation();
        contactInformation.setValue(value);
        return contactInformationRepository.save(contactInformation);
    }

    public ContactInformation updateContactInfo(Long id, String value) {
        return contactInformationRepository.findById(id).map(contactInfo -> {
            contactInfo.setValue(value);
            return contactInformationRepository.save(contactInfo);
        }).orElseThrow(() -> new RuntimeException("ContactInfo not found"));
    }

    public void deleteContactInfo(Long id) {
        contactInformationRepository.deleteById(id);
    }
}