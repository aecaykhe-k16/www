package fit.se.dto;

import java.io.Serializable;
import java.util.List;

import fit.se.models.BillDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class RoomDTO implements Serializable {
  private String room_ID;
  private String roomName;
  private List<String> images;
  private int limitQuantity;
  private int vote;
  private int acreage;
  private List<String> services;
  private String description;
  private double price;
  private List<BillDetail> bills;
  private String type_ID;

}
