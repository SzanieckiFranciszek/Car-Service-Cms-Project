package com.carservice.carservicecmsbackend.integration;

import com.carservice.carservicecmsbackend.model.User;
import com.carservice.carservicecmsbackend.model.UserRole;
import com.carservice.carservicecmsbackend.model.UserStatus;
import com.carservice.carservicecmsbackend.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;


    private User createTestUser() {
        User user = User.builder().firstName("Jan").lastName("Nowak").email("test@gmail.com").
                password("password123!").phoneNumber("213123").userRole(UserRole.USER)
                .userStatus(UserStatus.VERIFIED).build();
        return userRepository.save(user);
    }

    @Test
    @DisplayName("Should find user by email successfully")
    public void testFindUserByEmail() {
        //given
        User testUser = createTestUser();
        //when
        User userFromDb = userRepository.findByEmail(testUser.getEmail()).orElseThrow();

        //then
        Assertions.assertNotNull(userFromDb, "User don't exist in data base");
        Assertions.assertEquals(testUser.getId(), userFromDb.getId(), "User id don't match");
        Assertions.assertEquals(testUser.getFirstName(), userFromDb.getFirstName(),"User first name don't match");

    }

//    public void testNotFindByEmail(String email) {
//
//    }
//
//    public void testFindByUserRole(UserRole userRole) {
//
//    }
//
//    public void testNotFindByUserRole(UserRole userRole) {
//
//    }
//
//    public void testUserSave(User user) {
//
//
//    }
}

