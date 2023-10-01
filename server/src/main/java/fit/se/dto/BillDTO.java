package fit.se.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import fit.se.models.BillDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BillDTO implements Serializable {
  private String bill_ID;
  private Date date;
  private long total;
  private String user_ID;
  private List<BillDetail> billDetails;
}