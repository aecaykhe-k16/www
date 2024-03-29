package fit.se.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.se.exceptions.ResponeMessage;
import fit.se.models.User;
import fit.se.services.IAuthService;
import fit.se.services.IPasswordService;
import fit.se.services.IUserService;
import fit.se.util.AuthenticationRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class AuthCtrl {
  @Autowired
  private IUserService userService;
  @Autowired
  private IAuthService authService;
  @Autowired
  HttpServletRequest request;

  @Autowired
  private IPasswordService passwordService;

  private String emailUser;

  private Map<String, Integer> resetUrlUsageCount = new HashMap<>();

  @PostMapping("/register")
  public ResponseEntity<ResponeMessage> register(@RequestBody User user) {
    try {
      User existingUser = userService.getUser(user.getId() == null ? "" : user.getId());
      if (existingUser != null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ResponeMessage("error", "User already exists", null));
      }
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(new ResponeMessage("ok", "Please check your email",
              authService.register(user, getSiteURL(request))));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Internal server error", e.getMessage()));
    }
  }

  private String getSiteURL(HttpServletRequest request) {
    String siteURL = request.getRequestURL().toString();
    return siteURL.replace(request.getServletPath(), "");
  }

  @GetMapping("/verify")
  public ResponseEntity<ResponeMessage> verifyUser(@Param("code") String code) {
    try {

      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "Your account has been verified",
              authService.verify(code)));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ResponeMessage("error", "Verify failed", e.getMessage()));
    }
  }

  @PostMapping("/login")
  public ResponseEntity<ResponeMessage> login(@RequestBody AuthenticationRequest request) {
    try {
      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "Login successfully", authService.login(request)));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ResponeMessage("error", "Login failed", e.getMessage()));
    }
  }

  @GetMapping("/refresh")
  public ResponseEntity<ResponeMessage> refreshToken(@RequestHeader("Authorization") String token) {
    return ResponseEntity.status(HttpStatus.OK)
        .body(new ResponeMessage("ok", "Refresh token successfully", authService.refreshToken(token)));
  }

  @GetMapping("/logout")
  public ResponseEntity<ResponeMessage> logout(@RequestHeader("Authorization") String token) {
    try {
      authService.logout(token);
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "Logout successfully", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Internal server error", e.getMessage()));
    }
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<ResponeMessage> sendEmailResetPassword(@RequestBody Map<String, String> email) {
    try {

      emailUser = email.get("email");
      User user = userService.getUserByEmail(emailUser);
      authService.resetPassword(user.getEmail(), user.getFirstName(),
          getSiteURL(request));
      resetUrlUsageCount.put(authService.getResetPasswordUrl(), 0);
      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "Please check your email", null));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Internal server error", e.getMessage()));
    }
  }

  @GetMapping("/forgot-password/{forgetUrl}")
  public ResponseEntity<ResponeMessage> resetPassword(@PathVariable String forgetUrl) {
    try {
      String link = authService.getResetPasswordUrl();
      if (resetUrlUsageCount.containsKey(link) &&
          resetUrlUsageCount.get(link) < 1) {
        // Increate usage count
        resetUrlUsageCount.put(link,
            resetUrlUsageCount.get(link) + 1);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new ResponeMessage("ok", "Login successfully", forgetUrl));
      } else {
        return ResponseEntity.status(HttpStatus.URI_TOO_LONG)
            .body(new ResponeMessage("error", "uri no longer avaliable", forgetUrl));
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ResponeMessage("error", "Login failed", e.getMessage()));
    }
  }

  @PutMapping("/forgot-password")
  public ResponseEntity<ResponeMessage> setPassword(@RequestBody Map<String, String> objPass) {
    try {
      String email = objPass.get("email");
      String password = objPass.get("password");
      String cf_password = objPass.get("cfPassword");
      User user = userService.getUserByEmail(email);
      if (passwordService.checkPassword(password, user.getPassword()))
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ResponeMessage("error", "password is used. Please change new password", null));

      userService.forgetPassword(emailUser, cf_password);
      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "password have change", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ResponeMessage("error", "Login failed", e.getMessage()));
    }
  }

}
