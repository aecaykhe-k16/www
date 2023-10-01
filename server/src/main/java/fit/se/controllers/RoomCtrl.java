package fit.se.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fit.se.dto.RoomDTO;
import fit.se.exceptions.ResponeMessage;
import fit.se.models.Room;
import fit.se.services.IRoomService;
import fit.se.util.HashMapConverter;

@RestController
@RequestMapping("api/rooms")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoomCtrl {
  @Value("${spring.mail.username}")
  private String fromAddress;

  @Autowired
  private IRoomService roomService;

  @GetMapping(value = {
      "", "/"
  })
  public ResponseEntity<ResponeMessage> getRoom() {
    try {

      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", roomService.getRooms()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @PostMapping(value = {
      "", "/add"
  }, consumes = {
      "application/json",
      "application/x-www-form-urlencoded"
  })
  public ResponseEntity<ResponeMessage> addRoom(@RequestBody Room room) {

    try {
      roomService.addRoom(room);

      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<ResponeMessage> getRoomById(@PathVariable String roomId) {
    try {
      RoomDTO roomDTO = roomService.getRoom(roomId);

      if (roomDTO == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      HashMap<String, Object> response = HashMapConverter.toHashMap(roomDTO);
      response.remove("bills");
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
  public ResponseEntity<ResponeMessage> updateRoom(@RequestBody Room newRoom) {
    try {
      RoomDTO roomDTO = roomService.getRoom(newRoom.getRoom_ID());
      if (roomDTO == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      roomService.updateRoom(newRoom);
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @DeleteMapping("/{roomId}")
  public ResponseEntity<ResponeMessage> deleteRoom(@PathVariable String roomId) {
    try {
      RoomDTO roomDTO = roomService.getRoom(roomId);
      if (roomDTO == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      roomService.deleteRoom(roomId);
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/popular")
  public ResponseEntity<ResponeMessage> getPopularRoom() {
    try {
      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", roomService.getPopularRoom()));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/getByDate")
  public ResponseEntity<ResponeMessage> getRoomByDate(
      @RequestParam(name = "checkIn") @DateTimeFormat(pattern = "yyyy-MM-dd") Date checkIn,
      @RequestParam(name = "checkOut") @DateTimeFormat(pattern = "yyyy-MM-dd") Date checkOut) {
    try {
      List<RoomDTO> roomDTOs = roomService.getRoomsByDateCheckInOut(checkIn, checkOut);
      List<Map<String, Object>> roomMaps = new ArrayList<>();

      for (RoomDTO roomDTO : roomDTOs) {
        HashMap<String, Object> response = HashMapConverter.toHashMap(roomDTO);
        response.remove("bills");
        roomMaps.add(response);
      }

      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", roomMaps));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }
}
