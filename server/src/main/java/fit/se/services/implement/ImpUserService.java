package fit.se.services.implement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.se.models.Role;
import fit.se.models.User;
import fit.se.repositories.UserRepository;
import fit.se.services.IUserService;
import fit.se.util.HashMapConverter;

@Service
public class ImpUserService implements IUserService {
  @Autowired
  private UserRepository userRepo;

  @Autowired
  private ImpPasswordService passwordService;

  @Override
  public User addUser(User user) {
    User newUser = userRepo.findById(user.getId()).orElse(null);
    if (Objects.isNull(newUser)) {
      user.setPassword(passwordService.passwordEncoder().encode(user.getPassword()));
      user.setStatus(false);
      user.setRole(Role.USER);
      user.setVerificationCode(null);
      user.setEnabled(true);
      userRepo.save(user);
      return user;
    }
    return null;
  }

  @Override
  public List<Map<String, Object>> getUsers() {
    List<Map<String, Object>> usersMap = new ArrayList<>();
    List<User> users = userRepo.findAll();
    for (User user : users) {
      HashMap<String, Object> response = HashMapConverter.toHashMap(user);
      response.remove("password");
      response.remove("refreshToken");
      response.remove("verificationCode");
      response.remove("bills");
      usersMap.add(response);
    }

    return usersMap;
  }

  @Override
  public User getUserByEmail(String email) {
    User user = userRepo.findByEmail(email).orElse(null);
    if (Objects.isNull(user)) {
      return null;
    }
    return user;
  }

  @Override
  public boolean changePassword(String id, String password) {
    User user = userRepo.findById(id).orElse(null);
    if (Objects.nonNull(user)) {
      user.setPassword(passwordService.passwordEncoder().encode(password));
      userRepo.save(user);
      return true;
    }
    return false;
  }

  @Override
  public boolean forgetPassword(String email, String password) {
    User user = userRepo.findByEmail(email).orElse(null);
    if (Objects.nonNull(user)) {
      user.setPassword(passwordService.passwordEncoder().encode(password));
      userRepo.save(user);
      return true;
    }
    return false;
  }

  @Override
  public User getUser(String id) {
    User user = userRepo.findById(id).orElse(null);
    if (Objects.isNull(user)) {
      return null;
    }
    return user;
  }

  @Override
  public boolean updateUser(User user, User newUser) {
    if (Objects.nonNull(user)) {
      user.setAvatar(newUser.getAvatar());
      user.setPhone(newUser.getPhone());
      user.setFirstName(newUser.getFirstName());
      user.setLastName(newUser.getLastName());
      user.setPassword(passwordService.passwordEncoder().encode(newUser.getPassword()));

      userRepo.save(user);
      return true;
    }
    return false;
  }

  @Override
  public boolean deleteUser(String id) {
    if (userRepo.existsById(id)) {
      userRepo.deleteById(id);
      return true;
    }
    return false;
  }

  @Override
  public boolean renewUser(String email) {
    User user = userRepo.findByEmail(email).orElse(null);
    if (Objects.nonNull(user)) {
      user.setStatus(true);
      userRepo.save(user);
      return true;
    }
    return false;
  }

}
