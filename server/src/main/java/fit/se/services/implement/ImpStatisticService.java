package fit.se.services.implement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.se.dto.BillDTO;
import fit.se.dto.DataForStatistic;
import fit.se.models.Bill;
import fit.se.models.BillDetail;
import fit.se.repositories.BillDetailRepository;
import fit.se.repositories.BillRepository;
import fit.se.repositories.UserRepository;
import fit.se.services.IStatisticService;
import fit.se.util.HashMapConverter;

@Service
public class ImpStatisticService implements IStatisticService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private BillRepository billRepository;
  @Autowired
  private BillDetailRepository billDetailRepository;
  @Autowired
  private ModelMapper modelMapper;

  private BillDTO convertEntityToDTO(Bill bill) {
    BillDTO billDTO = new BillDTO();
    billDTO = modelMapper.map(bill, BillDTO.class);
    return billDTO;
  }

  @Override
  public double getTotalSales(Date dateFrom, Date dateTo) {
    double totalSales = 0;
    try {
      List<BillDTO> billDTOs = billRepository.findAllByDate(dateFrom, dateTo).stream().map(this::convertEntityToDTO)
          .collect(Collectors.toList());

      totalSales = totalSales(billDTOs);

    } catch (Exception e) {

      e.printStackTrace();
      return 0;
    }
    return totalSales;
  }

  @Override
  public double getTotalExpense(Date dateFrom, Date dateTo) {
    double totalExpense = 0;
    List<Object> bills = billDetailRepository.getAllBillDetail();
    for (Object o : bills) {
      Object[] bill = (Object[]) o;

      totalExpense += Double.parseDouble(String.valueOf(bill[6])) / 2;
    }
    return totalExpense;
  }

  @Override
  public long getTotalCustomer() {
    return userRepository.findAll().size();
  }

  @Override
  public List<Map<String, Object>> getDataOrderByYear() {
    List<DataForStatistic> list = new ArrayList<DataForStatistic>();
    Calendar calendar = Calendar.getInstance();
    int currentMonth = calendar.get(Calendar.MONTH) + 1;
    int currentYear = calendar.get(Calendar.YEAR);
    int count = 1;
    List<String> monthList = new ArrayList<String>(
        Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec"));
    List<Map<String, Object>> statisticMap = new ArrayList<>();
    double income = 0;
    double expense = 0;
    int i = currentMonth;

    while (count <= 12) {
      if (i == 0) {
        i = 12;
        currentYear--;
      }
      List<BillDTO> billDTOs = getBillByMonth(i, currentYear);
      expense = totalExpense(billDTOs);
      income = totalSales(billDTOs);
      DataForStatistic dataForStatistic = new DataForStatistic(monthList.get(i - 1) + "/" + currentYear, income,
          expense);
      list.add(dataForStatistic);

      i--;
      count++;
    }
    for (int j = list.size() - 1; j >= 0; j--) {
      HashMap<String, Object> response = HashMapConverter.toHashMap(list.get(j));

      statisticMap.add(response);
    }

    return statisticMap;
  }

  @Override
  public long getTotalOrder(Date dateFrom, Date dateTo) {

    return billRepository.findAllByDate(dateFrom, dateTo).size();
  }

  public long totalSales(List<BillDTO> bills) {
    long totalSales = 0;
    for (BillDTO bill : bills) {

      totalSales += bill.getTotal() + bill.getTotal() * 10 / 100;
    }
    return totalSales;
  }

  public double totalExpense(List<BillDTO> bills) {
    double totalExpense = 0;
    List<String> billIDList = new ArrayList<>();

    for (BillDTO billDTO : bills) {
      billIDList.add(billDTO.getBill_ID());
    }
    for (String string : billIDList) {
      List<BillDetail> billDetails = billDetailRepository.fillAllList(string);
      for (BillDetail billDetail : billDetails) {
        long time = Math.abs(billDetail.getCheckOut().getTime() - billDetail.getCheckIn().getTime());
        totalExpense += (billDetail.getUnitPrice() / 2) * (time / (24 * 60 * 60 * 1000));
      }
    }

    return totalExpense;
  }

  public List<BillDTO> getBillByMonth(int month, int year) {

    return billRepository.getBillListByMonth(month, year).stream().map(this::convertEntityToDTO)
        .collect(Collectors.toList());
  }

}
