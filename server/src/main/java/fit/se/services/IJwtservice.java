package fit.se.services;

import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;

public interface IJwtservice {
  // * encryption 256-bit

  String extractUsername(String token);

  String generateAccessToken(Map<String, Object> claims, UserDetails userDetails);

  String generateAccessToken(UserDetails userDetails);

  String generateRefreshToken(Map<String, Object> claims, UserDetails userDetails);

  String generateRefreshToken(UserDetails userDetails);

  boolean isTokenValid(String token, UserDetails userDetails);

  String refreshToken(String rfToken);

}
