package fit.se.util;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

public class QRCodeGenerator {
  public static String generateQRCodeImage(String text, int width, int height)
      throws WriterException, IOException {
    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

    String filePath = "server/src/main/resources/static/QR" + generateNumber() + ".png"; // modify the path as needed
    Path path = FileSystems.getDefault().getPath(filePath);
    MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    return filePath;
  }

  public static String generateNumber() {
    String number = "";
    for (int i = 0; i < 100; i++) {
      number += (int) (Math.random() * 10);
    }
    return number;
  }

}