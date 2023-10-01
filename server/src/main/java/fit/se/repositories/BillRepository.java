package fit.se.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fit.se.models.Bill;

@Repository
public interface BillRepository extends JpaRepository<Bill, String> {
  @Query(value = "select * from bills b where MONTH(b.date) = ?1 and Year(b.date) = ?2", nativeQuery = true)
  List<Bill> getBillListByMonth(int month, int year);

  @Query(value = "select top 6 * from bills b order By b.date desc", nativeQuery = true)
  List<Bill> getRecentOrder();

  @Query(value = "select * from bills b where b.date>= ?1 and b.date <= ?2 ", nativeQuery = true)
  List<Bill> findAllByDate(Date dateFrom, Date dateTo);

  @Query(value = "SELECT  bd.* FROM bill_details bd INNER JOIN bills b ON bd.bill_id = b.bill_id INNER JOIN users u ON b.user_id = u.user_id WHERE u.email = ?1 GROUP BY u.user_id, bd.bill_id, bd.room_id, bd.check_in, bd.check_out, bd.unit_price ORDER BY bd.bill_id DESC", nativeQuery = true)
  List<Object> getBillDetailByUser(String email);
}
