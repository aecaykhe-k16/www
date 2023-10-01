package fit.se.services.implement;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.se.dto.RoomDTO;
import fit.se.models.BillDetail;
import fit.se.models.Room;
import fit.se.repositories.BillDetailRepository;
import fit.se.repositories.RoomRepository;
import fit.se.services.IRoomService;
import fit.se.util.HashMapConverter;

@Service
public class ImpRoomService implements IRoomService {
  @Autowired
  private BillDetailRepository billDetailRepository;
  @Autowired
  private RoomRepository roomRepository;

  @Autowired
  private ModelMapper modelMapper;

  private RoomDTO convertEntityToDTO(Room room) {
    RoomDTO roomDTO = new RoomDTO();
    roomDTO = modelMapper.map(room, RoomDTO.class);
    return roomDTO;
  }

  @Override
  public RoomDTO addRoom(Room newRoom) {

    Room room = roomRepository.findById(newRoom.getRoom_ID()).orElse(null);
    if (room == null) {
      roomRepository.save(newRoom);
      return convertEntityToDTO(newRoom);
    }
    return null;
  }

  @Override
  public List<Map<String, Object>> getRooms() {
    List<RoomDTO> list = roomRepository.findAll().stream().map(this::convertEntityToDTO).collect(Collectors.toList());
    List<Map<String, Object>> roomMaps = new ArrayList<>();

    for (RoomDTO roomDTO : list) {
      HashMap<String, Object> response = HashMapConverter.toHashMap(roomDTO);
      response.remove("bills");
      roomMaps.add(response);
    }
    return roomMaps;
  }

  @Override
  public RoomDTO getRoom(String id) {
    Room room = roomRepository.findById(id).orElse(null);
    if (room == null)
      return null;
    else {
      return convertEntityToDTO(room);
    }
  }

  @Override
  public boolean updateRoom(Room newRoom) {
    Room room = roomRepository.findById(newRoom.getRoom_ID()).orElse(null);
    if (room != null) {
      room.setRoomName(newRoom.getRoomName());
      room.setLimitQuantity(newRoom.getLimitQuantity());
      room.setPrice(newRoom.getPrice());
      room.setAcreage(newRoom.getAcreage());
      room.setDescription(newRoom.getDescription());
      roomRepository.save(room);
      return true;
    }
    return false;
  }

  @Override
  public boolean deleteRoom(String id) {
    if (roomRepository.existsById(id)) {
      roomRepository.deleteById(id);
      return true;
    }
    return false;
  }

  @Override
  public List<Map<String, Object>> getPopularRoom() {
    List<RoomDTO> roomDTOs = roomRepository.getPopularRoom().stream().map(this::convertEntityToDTO)
        .collect(Collectors.toList());
    List<Map<String, Object>> roomMaps = new ArrayList<>();

    for (RoomDTO roomDTO : roomDTOs) {
      HashMap<String, Object> response = HashMapConverter.toHashMap(roomDTO);
      response.remove("bills");
      roomMaps.add(response);
    }
    return roomMaps;
  }

  @Override
  public List<RoomDTO> getRoomsByDateCheckInOut(Date checkIn, Date checkOut) {
    List<BillDetail> billDetails = billDetailRepository.findAll();

    List<Room> listRooms = new ArrayList<>();
    Set<String> roomID = new HashSet<>();

    for (BillDetail billDetail : billDetails) {
      if (billDetail.getCheckOut().before(checkIn) || billDetail.getCheckIn().after(checkOut)) {
        roomID.add(billDetail.getRooms().getRoom_ID());
      }
    }
    for (String string : roomID) {
      Optional<Room> room = roomRepository.findById(string);
      listRooms.add(room.get());
    }
    return listRooms.stream().map(this::convertEntityToDTO).collect(Collectors.toList());

  }
}
