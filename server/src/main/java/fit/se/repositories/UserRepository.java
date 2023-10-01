package fit.se.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fit.se.models.User;

public interface UserRepository extends JpaRepository<User, String> {
  @Query("SELECT u FROM User u WHERE u.verificationCode = ?1")
  public User findByVerificationCode(String code);

  Optional<User> findByEmail(String email);

  @Query(value = "select * from users where user_id = ?1", nativeQuery = true)
  User findByIDUser(String id);

  @Query(value = "update users set status = 1 where email = ?1", nativeQuery = true)
  boolean reNew(String email);

}
