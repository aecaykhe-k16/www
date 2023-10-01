package fit.se.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fit.se.models.BillDetail;
import fit.se.models.BillDetailPK;

@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail, BillDetailPK> {

  @Query(value = "Select * from bill_details b where b.bill_id = ?1", nativeQuery = true)
  List<BillDetail> getBillDetailByBillID(String billId);

  @Query(value = "Select * from bill_details b where b.bill_id = ?1 and b.room_id = ?2", nativeQuery = true)
  BillDetail getBillDetail(String billId, String roomID);

  @Query(value = "SELECT users.email, users.first_name, users.last_name, users.phone, bill_details.check_in, bill_details.check_out,bill_details.unit_price, rooms.room_name, rooms.room_id FROM bill_details INNER JOIN bills ON bill_details.bill_id = bills.bill_id INNER JOIN rooms ON bill_details.room_id = rooms.room_id INNER JOIN users ON bills.user_id = users.user_id", nativeQuery = true)
  List<Object> getAllBillDetail();

  @Query(value = "select * from bill_details where bill_id = ?1", nativeQuery = true)
  List<BillDetail> fillAllList(String billID);

}
