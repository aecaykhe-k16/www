package fit.se.services.implement;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import fit.se.services.IPasswordService;

@Service
public class ImpPasswordService implements IPasswordService {
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Override
  public boolean checkPassword(String rawPassword, String encryptedPassword) {
    return new BCryptPasswordEncoder().matches(rawPassword, encryptedPassword);
  }

}
