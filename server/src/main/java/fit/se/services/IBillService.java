package fit.se.services;

import java.util.List;
import java.util.Map;

import fit.se.dto.BillDTO;
import fit.se.models.Bill;

public interface IBillService {

  List<Map<String, Object>> getBills();

  BillDTO getBill(String id);

  BillDTO addBill(Bill newBill);

  boolean checkOut(BillDTO billDTO);

  List<Map<String, Object>> getBillsByUser(String email);

  List<Map<String, Object>> getBillDetails();

}
