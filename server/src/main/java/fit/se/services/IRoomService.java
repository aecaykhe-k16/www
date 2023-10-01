package fit.se.services;

import java.util.Date;
import java.util.List;
import java.util.Map;

import fit.se.dto.RoomDTO;
import fit.se.models.Room;

public interface IRoomService {

  RoomDTO addRoom(Room newRoom);

  List<Map<String, Object>> getRooms();

  RoomDTO getRoom(String id);

  boolean updateRoom(Room newRoom);

  boolean deleteRoom(String id);

  List<Map<String, Object>> getPopularRoom();

  List<RoomDTO> getRoomsByDateCheckInOut(Date checkIn, Date checkOut);
}
