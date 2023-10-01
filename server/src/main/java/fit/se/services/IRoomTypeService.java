package fit.se.services;

import java.util.List;

import fit.se.models.RoomType;

public interface IRoomTypeService {

  RoomType addRoomType(RoomType newRoom);

  List<RoomType> getRoomTypes();

  RoomType getRoomType(String id);

  boolean updateRoomType(RoomType newRoom);

  boolean deleteRoomType(String id);

  List<RoomType> getAllRoomOfRoomType();
}
