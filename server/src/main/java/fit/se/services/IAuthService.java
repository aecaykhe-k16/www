package fit.se.services;

import java.io.UnsupportedEncodingException;

import fit.se.models.User;
import fit.se.util.AuthenticationRequest;
import fit.se.util.AuthenticationResponse;
import jakarta.mail.MessagingException;

public interface IAuthService {
  String getResetPasswordUrl();

  void setResetPasswordUrl(String link);

  AuthenticationResponse register(User user, String siteURL) throws UnsupportedEncodingException, MessagingException;

  void resetPassword(String email, String userName, String link)
      throws UnsupportedEncodingException, MessagingException;

  AuthenticationResponse verify(String verificationCode);

  AuthenticationResponse login(AuthenticationRequest request);

  AuthenticationResponse refreshToken(String rfToken);

  void logout(String rfToken);

}
