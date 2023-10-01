package fit.se.services;

import java.util.List;
import java.util.Map;

import fit.se.models.User;

public interface IUserService {

  User addUser(User user);

  List<Map<String, Object>> getUsers();

  User getUserByEmail(String email);

  boolean changePassword(String id, String password);

  boolean forgetPassword(String email, String password);

  User getUser(String id);

  boolean updateUser(User oldUser, User user);

  boolean deleteUser(String id);

  boolean renewUser(String email);

}
