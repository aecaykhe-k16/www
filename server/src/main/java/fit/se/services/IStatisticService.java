package fit.se.services;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public interface IStatisticService {
  double getTotalSales(Date dateFrom, Date dateTo);

  double getTotalExpense(Date dateFrom, Date dateTo);

  long getTotalCustomer();

  List<Map<String, Object>> getDataOrderByYear();

  long getTotalOrder(Date dateFrom, Date dateTo);
}
