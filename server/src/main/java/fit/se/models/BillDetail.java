package fit.se.models;

import java.util.Date;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@IdClass(BillDetailPK.class)
@Table(name = "billDetails")

public class BillDetail {
	@Id
	@ManyToOne
	@JoinColumn(name = "bill_id")
	private Bill bills;

	@Id
	@ManyToOne
	@JoinColumn(name = "room_id")
	private Room rooms;

	private Date checkIn;
	private Date checkOut;
	private long unitPrice;

	@Override
	public String toString() {
		return "BillDetail [ checkIn=" + checkIn + ", checkOut=" + checkOut
				+ ", unitPrice=" + unitPrice + "]";
	}

}
