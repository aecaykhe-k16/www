package fit.se.services;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

public interface IPasswordService {
  @Bean
  public PasswordEncoder passwordEncoder();

  public boolean checkPassword(String rawPassword, String encryptedPassword);

}
