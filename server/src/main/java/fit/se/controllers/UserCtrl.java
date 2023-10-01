package fit.se.controllers;

import java.util.HashMap;
import java.util.concurrent.ExecutionException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.se.exceptions.ResponeMessage;
import fit.se.models.User;
import fit.se.services.IPasswordService;
import fit.se.services.IUserService;
import fit.se.util.HashMapConverter;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserCtrl {
  @Autowired
  private IUserService userService;

  @Autowired
  private IPasswordService passwordService;

  @GetMapping(value = {
      "", "/"
  })
  public ResponseEntity<ResponeMessage> getUsers() throws InterruptedException, ExecutionException {
    try {
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", userService.getUsers()));
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping(value = {
      "", "/add"
  }, consumes = {
      "application/json",
      "application/x-www-form-urlencoded"
  })
  public ResponseEntity<ResponeMessage> addUser(@RequestBody User user) {
    try {
      userService.addUser(user);

      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/{userId}")
  public ResponseEntity<ResponeMessage> getUser(@PathVariable String userId) {
    try {
      User user = userService.getUser(userId);
      if (user == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      HashMap<String, Object> response = HashMapConverter.toHashMap(user);
      response.remove("password");
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", response));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/email")
  public ResponseEntity<ResponeMessage> getOne(@Param("email") String email) {
    try {
      User user = userService.getUserByEmail(email);
      HashMap<String, Object> response = HashMapConverter.toHashMap(user);
      response.remove("password");
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", response));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @PutMapping(value = {
      "", "/update"
  }, consumes = {
      "application/json",
      "application/x-www-form-urlencoded"
  })
  public ResponseEntity<ResponeMessage> updateUser(@RequestBody User newUser) {
    try {
      User user = userService.getUserByEmail(newUser.getEmail());
      if (user == null) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ResponeMessage("error", "Not found", "User not found"));
      }
      userService.updateUser(user, newUser);
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @DeleteMapping("/{userId}")
  public ResponseEntity<ResponeMessage> deleteUser(@PathVariable String userId) {
    try {
      User user = userService.getUser(userId);
      if (user == null) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ResponeMessage("error", "Not found", "User not found"));
      }
      userService.deleteUser(userId);
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @PutMapping(value = {
      "", "/change-password"
  }, consumes = {
      "application/json",
      "application/x-www-form-urlencoded"
  })
  public ResponseEntity<ResponeMessage> changePassword(@Param("id") String id,
      @Param("oldPassword") String oldPassword, @Param("password") String password) {
    try {
      User user = userService.getUser(id);

      if (!passwordService.checkPassword(oldPassword, user.getPassword())) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ResponeMessage("error", "Password not match", "Old password did not math"));
      }
      boolean result = userService.changePassword(id, password);
      if (result == false) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ResponeMessage("error", "Not found", "User not found"));
      }
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok",
          "success", "Password changed successfully"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @PutMapping("/renew-user")
  public ResponseEntity<ResponeMessage> renewUser(@RequestBody Map<String, String> body) {
    try {
      String email = body.get("email");
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok",
          "success", userService.renewUser(email)));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }
}
