package fit.se.services.implement;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import fit.se.dto.BillDTO;
import fit.se.models.Bill;
import fit.se.models.BillDetail;
import fit.se.models.User;
import fit.se.repositories.BillDetailRepository;
import fit.se.repositories.BillRepository;
import fit.se.repositories.UserRepository;
import fit.se.services.IBillService;
import fit.se.util.HashMapConverter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class ImpBillService implements IBillService {
  @Autowired
  private BillRepository billRepository;

  @Autowired
  private BillDetailRepository billDetailRepository;

  @Autowired
  private UserRepository userRepository;
  @Value("${spring.mail.username}")
  private String fromAddress;
  @Autowired
  private JavaMailSender mailSender;

  /**
   *
   * @param bill
   * @return BillDTO after convert billEntity to BillDTO
   */
  private BillDTO convertEntityToDTO(Bill bill) {
    BillDTO billDTO = new BillDTO();
    billDTO.setBill_ID(bill.getBill_ID());
    billDTO.setDate(new Date(bill.getDate().getTime()));
    billDTO.setTotal(bill.getTotal());
    billDTO.setUser_ID(bill.getUser().getId());
    return billDTO;
  }

  public List<Map<String, Object>> getBills() {
    List<BillDTO> billDTOs = billRepository.findAll().stream().map(this::convertEntityToDTO)
        .collect(Collectors.toList());
    List<Map<String, Object>> billMaps = new ArrayList<>();

    for (BillDTO billDTO : billDTOs) {
      Map<String, Object> response = HashMapConverter.toHashMap(billDTO);
      response.remove("rooms");
      billMaps.add(response);
    }
    return billMaps;
  }

  @Override
  public BillDTO getBill(String id) {
    Bill bill = billRepository.findById(id).orElse(null);
    if (bill == null)
      return null;
    else
      return convertEntityToDTO(bill);
  }

  @Override
  public BillDTO addBill(Bill newBill) {
    Bill bill = billRepository.findById(newBill.getBill_ID()).orElse(null);
    if (bill == null) {
      billRepository.save(bill);
      return convertEntityToDTO(newBill);
    } else
      return null;
  }

  @Override
  public boolean checkOut(BillDTO billDTO) {
    User user = userRepository.findById(billDTO.getUser_ID()).orElse(null);
    Bill bill = new Bill(billDTO.getBill_ID(), new Date(), billDTO.getTotal(),
        user, null);
    if (bill.getUser() == null) {
      return false;
    } else {
      billRepository.save(bill);
      for (BillDetail b : billDTO.getBillDetails()) {
        b.setBills(bill);
        billDetailRepository.save(b);
      }
    }

    try {
      sendNotifyPurchaseEmail(user);
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    } catch (MessagingException e) {
      e.printStackTrace();
    }

    return true;
  }

  private void sendNotifyPurchaseEmail(User user) throws UnsupportedEncodingException, MessagingException {
    String toAddress = user.getEmail();
    String fromAddress = "alexbanjaman87@gmail.com";
    String senderName = "StarlightHotel";
    String subject = "Thank you for your purchase with us!";
    String content = "<div style=' padding: 0;margin: 0;background-color: #ff6e12;width: 100%;color: #38363a;font-family: Comic Sans MS, helvetica,arial, sans-serif;        -webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%; '><div class='width:width: 590px'><table style='background-color: #fff;padding-left: 30px; padding-right: 30px;width: 100%;'><tr > <td colspan='2' style='color: #38363a;font-size:40px;font-weight: 800;  ' align='center'><img src='https://gdlcba.stripocdn.email/content/guids/CABINET_bc29b1f1c9da90b26496e5e48baa3e12ee8a53ea958ed39ccd4f3ad337c71c63/images/1.png' alt='Logo' style=' display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;'  title='Logo' width='60'  height='60' />"
        +
        " Starlight Hotel</td> </tr> <tr style='background-color: #fef852;padding-bottom: 10px; '> <td align='center' style=' margin: 0; padding-bottom: 20px;  padding-top: 30px; border-radius: 20px; width: 520px '> <h1 style='  margin: 0; line-height: 48px;  font-size: 40px;  font-style: normal;  font-weight: normal;  color: #2d033a; ' >  Thank You<br />for Choosing Us</h1><br>  <p  style='  margin: 0; -webkit-text-size-adjust: none;  -ms-text-size-adjust: none;  line-height: 24px;  color: #38363a;  font-size: 16px; ' > for the best service! </p> </td>  </tr> <td> <p>Dear "
        + user.getFirstName()
        + ",</p> <p>We just wanted to take a moment to thank you for choosing our hotel. We hope that you enjoyed the room at the hotel and the service and that we met your expectations.</p>  <p>If there's anything we can do to make your experience even better, please don't hesitate to let us know. We appreciate your feedback and are always looking for ways to improve.</p> <p>Thank you again for your business. We look forward to serving you again soon!</p> <p>Best regards,<br>  Starlight Hotel</p> </td>  </tr><tr> <td align='center'> <img    class='adapt-img'     src='https://gdlcba.stripocdn.email/content/guids/CABINET_bc29b1f1c9da90b26496e5e48baa3e12ee8a53ea958ed39ccd4f3ad337c71c63/images/my_gallery.png' alt  style='  display: block;   border: 0; outline: none;  text-decoration: none;  -ms-interpolation-mode: bicubic; ' width='150' /> </td> </tr> </table> <table style='width: 100%; padding-top: 20px; padding-bottom: 20px;'>    <tr style='background-color: #ff6e12; '>   <td align='center' style='background-color:#ff6e12 ;'>   <a href='' style='color: #fff; text-decoration: none;margin-right: 80px;margin-left: 80px;'>About us</a>  <a href='' style='color: #fff; text-decoration: none;margin-right: 80px;'>News</a>  <a href='' style='color: #fff; text-decoration: none;margin-right: 80px;'>Our hotel</a>  </td> </tr>  <tr> <td style='display: flex; align-items: center; justify-content: center; padding-top: 10px;' align='center'> </td></tr><tr ><td align='center' ><p style='font-size: 13px; color: #fff;'>You are receiving this email because you have visited our site or asked us about the regular newsletter.<br> Make sure our messages get to your Inbox (and not your bulk or junk folders).</p>"
        +
        "</td></tr></table></div></div>";

    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message);
    helper.setFrom(fromAddress, senderName);
    helper.setTo(toAddress);
    helper.setSubject(subject);

    helper.setText(content, true);
    mailSender.send(message);

  }

  @Override
  public List<Map<String, Object>> getBillsByUser(String email) {
    List<Map<String, Object>> result = new ArrayList<>();
    List<Object> bills = billRepository.getBillDetailByUser(email);
    for (Object o : bills) {
      Object[] bill = (Object[]) o;
      Map<String, Object> map = new HashMap<>();
      map.put("bill_ID", bill[0]);
      map.put("room_ID", bill[1]);

      map.put("check_in", bill[2].toString().split(" ")[0].replace("-", "/"));
      map.put("check_out", bill[3].toString().split(" ")[0].replace("-", "/"));
      map.put("unit_price", bill[4]);
      result.add(map);
    }
    return result;
  }

  @Override
  public List<Map<String, Object>> getBillDetails() {
    List<Map<String, Object>> result = new ArrayList<>();
    List<Object> bills = billDetailRepository.getAllBillDetail();
    for (Object o : bills) {
      Object[] bill = (Object[]) o;
      Map<String, Object> map = new HashMap<>();
      String checkIn = bill[4].toString().split(" ")[0].replace("-", "/");
      String checkOut = bill[5].toString().split(" ")[0].replace("-", "/");
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
      long getDiff = 0;

      try {
        getDiff = sdf.parse(checkOut).getTime() - sdf.parse(checkIn).getTime();
      } catch (ParseException e) {
        e.printStackTrace();
      }
      map.put("email", bill[0]);
      map.put("fullName", bill[1] + " " + bill[2]);
      map.put("phone", bill[3]);
      map.put("check_in", bill[4].toString().split(" ")[0].replace("-", "/"));
      map.put("check_out", bill[5].toString().split(" ")[0].replace("-", "/"));
      map.put("unit_price", bill[6]);
      map.put("room_name", bill[7]);
      map.put("room_id", bill[8]);
      map.put("total_price", Double.parseDouble(bill[6].toString()) * (getDiff / (24 * 60 * 60 * 1000) - 1));
      result.add(map);
    }
    return result;
  }

}
