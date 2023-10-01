package fit.se.controllers;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fit.se.dto.BillDTO;
import fit.se.exceptions.ResponeMessage;
import fit.se.services.IBillService;
import fit.se.util.HashMapConverter;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BillCtrl {

  @Autowired
  private IBillService billService;

  @GetMapping(value = { "", "/" })
  public ResponseEntity<ResponeMessage> getBills() {
    try {
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", billService.getBills()));
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @PostMapping(value = {
      "", "/checkout"
  }, consumes = {
      "application/json",
      "application/x-www-form-urlencoded"
  })
  public ResponseEntity<ResponeMessage> checkOut(@RequestBody BillDTO data) {
    try {
      boolean result = billService.checkOut(data);

      if (result) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(new ResponeMessage("ok", "Your bill has been checked out", null));
      } else {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ResponeMessage("error", "The bill could not be checked out", null));
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "An error occurred while checking out your bill", e.getMessage()));
    }
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<ResponeMessage> getRoomById(@PathVariable String billId) {
    try {
      BillDTO billDTO = billService.getBill(billId);

      if (billDTO == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      HashMap<String, Object> response = HashMapConverter.toHashMap(billDTO);
      response.remove("rooms");
      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", response));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/billOfUser")
  public ResponseEntity<ResponeMessage> getBillByUser(@RequestParam(name = "email") String email) {
    try {

      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", billService.getBillsByUser(email)));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/billDetails")
  public ResponseEntity<ResponeMessage> getBillDetails() {
    try {

      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", billService.getBillDetails()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

}
