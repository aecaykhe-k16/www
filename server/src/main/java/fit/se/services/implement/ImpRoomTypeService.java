package fit.se.services.implement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.se.models.Room;
import fit.se.models.RoomType;
import fit.se.repositories.RoomRepository;
import fit.se.repositories.RoomTypeRepository;
import fit.se.services.IRoomTypeService;

@Service
public class ImpRoomTypeService implements IRoomTypeService {
  @Autowired
  private RoomTypeRepository roomTypeRepository;
  @Autowired
  private RoomRepository roomRepository;

  @Override
  public RoomType addRoomType(RoomType newRoom) {
    RoomType roomType = roomTypeRepository.findById(newRoom.getType_ID()).orElse(null);

    if (roomType == null) {

      roomTypeRepository.save(newRoom);
      return newRoom;
    }
    return null;
  }

  @Override
  public List<RoomType> getRoomTypes() {
    return roomTypeRepository.findAll();
  }

  @Override
  public RoomType getRoomType(String id) {
    return roomTypeRepository.findById(id).orElse(null);
  }

  @Override
  public boolean updateRoomType(RoomType newRoom) {
    RoomType roomType = roomTypeRepository.findById(newRoom.getType_ID()).orElse(null);

    if (roomType != null) {
      roomTypeRepository.save(newRoom);
      return true;
    }
    return false;
  }

  @Override
  public boolean deleteRoomType(String id) {
    if (roomTypeRepository.existsById(id)) {
      roomTypeRepository.deleteById(id);
      return true;
    }
    return false;
  }

  @Override
  public List<RoomType> getAllRoomOfRoomType() {
    List<RoomType> roomTypes = roomTypeRepository.findAll();
    roomTypes.forEach(roomType -> {
      List<Room> rooms = roomRepository.findByRoomType_TypeID(roomType.getType_ID());
      roomType.setRooms(rooms);
    });

    return roomTypes;
  }
}
