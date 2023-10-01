package fit.se.controllers;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fit.se.exceptions.ResponeMessage;
import fit.se.services.IStatisticService;

@RestController
@RequestMapping(value = { "/api/statistics" })
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StatisticCtrl {
  @Autowired
  private IStatisticService statisticService;

  @GetMapping("/totalSales")
  public ResponseEntity<ResponeMessage> getTotalSales(
      @RequestParam(name = "dateFrom") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFrom,
      @RequestParam(name = "dateTo") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateTo) {
    try {
      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", statisticService.getTotalSales(dateFrom, dateTo)));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/totalExpense")
  public ResponseEntity<ResponeMessage> getTotalExpense(
      @RequestParam(name = "dateFrom") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFrom,
      @RequestParam(name = "dateTo") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateTo) {
    try {
      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", statisticService.getTotalExpense(dateFrom, dateTo)));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/totalCustomer")
  public ResponseEntity<ResponeMessage> getTotalCustomer() {
    try {

      long totalCustomer = statisticService.getTotalCustomer();

      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", totalCustomer));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/totalOrder")
  public ResponseEntity<ResponeMessage> getTotalOrder(
      @RequestParam(name = "dateFrom") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFrom,
      @RequestParam(name = "dateTo") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateTo) {
    try {

      long totalOrder = statisticService.getTotalOrder(dateFrom, dateTo);

      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", totalOrder));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/getDataOrderByYear")
  public ResponseEntity<ResponeMessage> getDataOrderByYear() {
    try {

      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", statisticService.getDataOrderByYear()));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

}
