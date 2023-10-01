package fit.se.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fit.se.models.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

  @Query(value = "SELECT * FROM rooms WHERE room_id IN (SELECT room_id FROM bill_details GROUP BY room_id having count(room_id) >=4 )", nativeQuery = true)
  List<Room> getPopularRoom();

  @Query(value = "select top 1 * from rooms where type_id = :type_id", nativeQuery = true)
  List<Room> findByRoomType_TypeID(String type_id);

}
