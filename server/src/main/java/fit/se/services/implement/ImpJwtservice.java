package fit.se.services.implement;

import java.security.Key;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import fit.se.repositories.RefreshTokenRepository;
import fit.se.services.IJwtservice;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.var;

@Service
@RequiredArgsConstructor
public class ImpJwtservice implements IJwtservice {
  // * encryption 256-bit
  private static final String SECRET_KEY = "7A25432A462D4A614E645267556B58703273357638792F423F4428472B4B6250";
  @Autowired
  private RefreshTokenRepository refreshTokenRepository;

  @Override
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(getSignIKey()).build().parseClaimsJws(token).getBody();
  }

  private Key getSignIKey() {
    byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  @Override
  public String generateAccessToken(Map<String, Object> claims, UserDetails userDetails) {
    return Jwts.builder().setClaims(claims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15min
        .signWith(getSignIKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  @Override
  public String generateAccessToken(UserDetails userDetails) {
    return generateAccessToken(new HashMap<>(), userDetails);
  }

  @Override
  public String generateRefreshToken(Map<String, Object> claims, UserDetails userDetails) {
    return Jwts.builder().setClaims(claims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 30 days
        .signWith(getSignIKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  @Override
  public String generateRefreshToken(UserDetails userDetails) {
    return generateRefreshToken(new HashMap<>(), userDetails);
  }

  private boolean isTokenExpired(Date expirationTime) {
    return expirationTime.after(Date.from(ZonedDateTime.now(ZoneId.of("UTC")).toInstant()));

  }

  @Override
  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()));
  }

  @Override
  public String refreshToken(String rfToken) {

    var tokenOpt = refreshTokenRepository.findRefreshTokenByToken(rfToken);

    if (tokenOpt.isEmpty()) {
      System.out.println("Invalid refresh token".formatted(rfToken));
    }

    var token = tokenOpt.get();
    if (!isTokenExpired(token.getExpiration())) {
      // refreshTokenRepository.delete(token);
      throw new RuntimeException("Refresh Token %s was expired!".formatted(rfToken));
    }

    var user = token.getUser();
    String newToken = generateRefreshToken(user);
    token.setToken(newToken);
    token.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)); // 30 days

    refreshTokenRepository.save(token);

    return newToken;
  }

}
