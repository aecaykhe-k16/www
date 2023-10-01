package fit.se.services.implement;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import fit.se.models.RefreshToken;
import fit.se.models.Role;
import fit.se.models.User;
import fit.se.repositories.RefreshTokenRepository;
import fit.se.repositories.UserRepository;
import fit.se.services.IAuthService;
import fit.se.util.AuthenticationRequest;
import fit.se.util.AuthenticationResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.var;

@Service
@RequiredArgsConstructor
public class ImpAuthService implements IAuthService {
  @Value("${spring.mail.username}")
  private String fromAddress;

  private String link;
  @Autowired
  private UserRepository userRepo;
  @Autowired
  private JavaMailSender mailSender;
  @Autowired
  private ImpPasswordService passwordService;
  @Autowired
  private ImpJwtservice jwtService;

  @Autowired
  private UserRepository userRepository;
  @Autowired
  private RefreshTokenRepository refreshTokenRepository;
  @Autowired(required = true)
  private AuthenticationManager authenticationManager;

  @Override
  public String getResetPasswordUrl() {
    return link;
  }

  @Override
  public void setResetPasswordUrl(String link) {
    this.link = link;
  }

  @Override
  public AuthenticationResponse register(User user, String siteURL)
      throws UnsupportedEncodingException, MessagingException {
    String encodedPassword = passwordService.passwordEncoder().encode(user.getPassword());
    user.setPassword(encodedPassword);
    UUID randomCode = UUID.randomUUID();
    user.setVerificationCode(randomCode.toString());
    user.setEnabled(false);
    user.setRole(Role.USER);
    user.setCreatedAt(new Date());
    userRepo.save(user);
    sendVerificationEmail(user, siteURL);
    var tokenOpt = refreshTokenRepository.findByUser(user);
    String newToken = "";
    String accesToken = "";
    if (tokenOpt.isPresent()) {
      var token = tokenOpt.get();
      newToken = jwtService.generateRefreshToken(user);
      token.setToken(newToken);
      token.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60));// 30 days
      refreshTokenRepository.save(token);
      accesToken = jwtService.generateAccessToken(user);

    }
    return AuthenticationResponse.builder().accessToken(accesToken).refreshToken(newToken)
        .firstName(user.getFirstName()).lastName(user.getLastName()).avatar(user.getAvatar())
        .phone(user.getPhone())
        .email(user.getEmail()).role(user.getRole().toString()).build();

  }

  private void sendVerificationEmail(User user, String siteURL)
      throws MessagingException, UnsupportedEncodingException {
    String toAddress = user.getEmail();
    String fromAddress = "alexbanjaman87@gmail.com";
    String senderName = "StarlightHotel";
    String subject = "Please verify your registration";

    String content = "<h3>Dear [[name]],</h3>"
        + "Have a nice day! <br>To continue to register an account at our hotel. Please click the link below to verify your registration:<br>"
        + "<h2><a style='text-decoration: none' href=\"[[URL]]\" target=\"_self\">VERIFY</a></h2>"
        + "Thank you for registering an account in our hotel.<hr>"
        + "<table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td width='150' style='vertical-align: middle;'><span class='template3__ImageContainer-sc-vj949k-0 kElCTu' style='margin-right: 20px; display: block;'><img src='https://drive.google.com/uc?id=1DEFYYLLzItUAW9vBM2-8FBqI3rSHLtGR' role='presentation' width='130' class='image__StyledImage-sc-hupvqm-0 fQKUvi' style='max-width: 130px;'></span></td><td style='vertical-align: middle;'><h2 color='#000000' class='name__NameContainer-sc-1m457h3-0 hkyYrA' style='margin: 0px; font-size: 16px; color: rgb(0, 0, 0); font-weight: 600;'><span>Starlight</span><span>&nbsp;</span><span>Hotel</span></h2><p color='#000000' font-size='small' class='job-title__Container-sc-1hmtp73-0 iJcqpv' style='margin: 0px; color: rgb(0, 0, 0); font-size: 12px; line-height: 20px;'><span>Always serves!</span></p></td><td width='30'><div style='width: 30px;'></div></td><td color='#f2547d' direction='vertical' width='1' height='auto' class='color-divider__Divider-sc-1h38qjv-0 dcKmvZ' style='width: 1px; border-bottom: none; border-left: 1px solid rgb(242, 84, 125);'></td><td width='30'><div style='width: 30px;'></div></td><td style='vertical-align: middle;'><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr height='25' style='vertical-align: middle;'><td width='30' style='vertical-align: middle;'><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td style='vertical-align: bottom;'><span color='#f2547d' width='11' class='contact-info__IconWrapper-sc-mmkjr6-1 hBHfIp' style='display: inline-block; background-color: rgb(242, 84, 125);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/phone-icon-2x.png' color='#f2547d' alt='mobilePhone' width='13' class='contact-info__ContactLabelIcon-sc-mmkjr6-0 dGVIJx' style='display: block; background-color: rgb(242, 84, 125);'></span></td></tr></tbody></table></td><td style='padding: 0px; color: rgb(0, 0, 0);'><a href='tel:111 222 333' color='#000000' class='contact-info__ExternalLink-sc-mmkjr6-2 bibcmr' style='text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;'><span>111 222 333</span></a></td></tr><tr height='25' style='vertical-align: middle;'><td width='30' style='vertical-align: middle;'><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td style='vertical-align: bottom;'><span color='#f2547d' width='11' class='contact-info__IconWrapper-sc-mmkjr6-1 hBHfIp' style='display: inline-block; background-color: rgb(242, 84, 125);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/email-icon-2x.png' color='#f2547d' alt='emailAddress' width='13' class='contact-info__ContactLabelIcon-sc-mmkjr6-0 dGVIJx' style='display: block; background-color: rgb(242, 84, 125);'></span></td></tr></tbody></table></td><td style='padding: 0px;'><a href='mailto:hello@gmail.com' color='#000000' class='contact-info__ExternalLink-sc-mmkjr6-2 bibcmr' style='text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;'><span>hello@gmail.com</span></a></td></tr><tr height='25' style='vertical-align: middle;'><td width='30' style='vertical-align: middle;'><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td style='vertical-align: bottom;'><span color='#f2547d' width='11' class='contact-info__IconWrapper-sc-mmkjr6-1 hBHfIp' style='display: inline-block; background-color: rgb(242, 84, 125);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/link-icon-2x.png' color='#f2547d' alt='website' width='13' class='contact-info__ContactLabelIcon-sc-mmkjr6-0 dGVIJx' style='display: block; background-color: rgb(242, 84, 125);'></span></td></tr></tbody></table></td><td style='padding: 0px;'><a href='//www.starlighthotel.com' color='#000000' class='contact-info__ExternalLink-sc-mmkjr6-2 bibcmr' style='text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;'><span>www.starlighthotel.com</span></a></td></tr><tr height='25' style='vertical-align: middle;'><td width='30' style='vertical-align: middle;'><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td style='vertical-align: bottom;'><span color='#f2547d' width='11' class='contact-info__IconWrapper-sc-mmkjr6-1 hBHfIp' style='display: inline-block; background-color: rgb(242, 84, 125);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/address-icon-2x.png' color='#f2547d' alt='address' width='13' class='contact-info__ContactLabelIcon-sc-mmkjr6-0 dGVIJx' style='display: block; background-color: rgb(242, 84, 125);'></span></td></tr></tbody></table></td><td style='padding: 0px;'><span color='#000000' class='contact-info__Address-sc-mmkjr6-3 fhjLwd' style='font-size: 12px; color: rgb(0, 0, 0);'><span>123</span></span></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='width: 100%; vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td height='30'></td></tr><tr><td color='#f2547d' direction='horizontal' width='auto' height='1' class='color-divider__Divider-sc-1h38qjv-0 dcKmvZ' style='width: 100%; border-bottom: 1px solid rgb(242, 84, 125); border-left: none; display: block;'></td></tr><tr><td height='30'></td></tr></tbody></table></td></tr><tr><td><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='width: 100%; vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr><td style='vertical-align: top;'></td><td style='text-align: right; vertical-align: top;'><table cellpadding='0' cellspacing='0' class='table__StyledTable-sc-1avdl6r-0 jWJRxL' style='display: inline-block; vertical-align: -webkit-baseline-middle; font-size: small; font-family: Verdana;'><tbody><tr style='text-align: right;'><td><a href='//hfghgf' color='#6a78d1' class='social-links__LinkAnchor-sc-py8uhj-2 jhqNFe' style='display: inline-block; padding: 0px; background-color: rgb(106, 120, 209);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/facebook-icon-2x.png' alt='facebook' color='#6a78d1' height='24' class='social-links__LinkImage-sc-py8uhj-1 kLZBAf' style='background-color: rgb(106, 120, 209); max-width: 135px; display: block;'></a></td><td width='5'><div></div></td><td><a href='//fghfg' color='#6a78d1' class='social-links__LinkAnchor-sc-py8uhj-2 jhqNFe' style='display: inline-block; padding: 0px; background-color: rgb(106, 120, 209);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/twitter-icon-2x.png' alt='twitter' color='#6a78d1' height='24' class='social-links__LinkImage-sc-py8uhj-1 kLZBAf' style='background-color: rgb(106, 120, 209); max-width: 135px; display: block;'></a></td><td width='5'><div></div></td><td><a href='//vbvcb' color='#6a78d1' class='social-links__LinkAnchor-sc-py8uhj-2 jhqNFe' style='display: inline-block; padding: 0px; background-color: rgb(106, 120, 209);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/linkedin-icon-2x.png' alt='linkedin' color='#6a78d1' height='24' class='social-links__LinkImage-sc-py8uhj-1 kLZBAf' style='background-color: rgb(106, 120, 209); max-width: 135px; display: block;'></a></td><td width='5'><div></div></td><td><a href='//fgh' color='#6a78d1' class='social-links__LinkAnchor-sc-py8uhj-2 jhqNFe' style='display: inline-block; padding: 0px; background-color: rgb(106, 120, 209);'><img src='https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/instagram-icon-2x.png' alt='instagram' color='#6a78d1' height='24' class='social-links__LinkImage-sc-py8uhj-1 kLZBAf' style='background-color: rgb(106, 120, 209); max-width: 135px; display: block;'></a></td><td width='5'><div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td height='30'></td></tr></tbody></table>";

    String urlClient = "http://localhost:3000/verify?code=" + user.getVerificationCode();
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message);
    helper.setFrom(fromAddress, senderName);
    helper.setTo(toAddress);
    helper.setSubject(subject);

    content = content.replace("[[name]]", user.getFirstName());

    content = content.replace("[[URL]]", urlClient);
    helper.setText(content, true);
    mailSender.send(message);

  }

  @Override
  public void resetPassword(String email, String userName, String link)
      throws UnsupportedEncodingException, MessagingException {
    String toAddress = email;
    String pathClient = "http://localhost:3000";
    String senderName = "StarlightHotel";
    String subject = "Reset your password";
    link = pathClient + "/forgot-password/" + UUID.randomUUID().toString();
    setResetPasswordUrl(link);

    String content = "<div class='es-wrapper-color' style='background-color:#FFFFFF;width:100%;font-family: Comic Sans MS, helvetica,arial, sans-serif; '><!--[if gte mso 9]><v:background xmlns:v='urn:schemas-microsoft-com:vml' fill='t'> <v:fill type='tile' color='#ffffff'></v:fill> </v:background><![endif]--><table class='es-wrapper' width='100%' cellspacing='0' cellpadding='0' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF'><tr><td valign='top' style='padding:0;Margin:0'><table cellpadding='0' cellspacing='0' class='es-header' align='center' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top'><tr><td align='center' style='padding:0;Margin:0'><table bgcolor='#ffffff' class='es-header-body' align='center' cellpadding='0' cellspacing='0' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px'><tr><td align='left' style='padding:20px;Margin:0'><table cellpadding='0' cellspacing='0' width='100%' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'><tr><td class='es-m-p0r' valign='top' align='center' style='padding:0;Margin:0;width:560px'><table cellpadding='0' cellspacing='0' width='100%' role='presentation' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'><tr><td align='center' style='padding:0;Margin:0'><h1 style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'comic sans ms', 'marker felt-thin', arial, sans-serif;line-height:60px;color:#333333;font-size:40px;text-align:center'>Starlight Hotel</h1></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table class='es-content' cellspacing='0' cellpadding='0' align='center' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%'><tr><td align='center' style='padding:0;Margin:0'><table class='es-content-body' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center'><tr><td align='left' style='padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px'><table cellpadding='0' cellspacing='0' width='100%' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'><tr><td align='center' valign='top' style='padding:0;Margin:0;width:560px'><table cellpadding='0' cellspacing='0' width='100%' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:1px solid #dfdfdf;border-right:1px solid #dfdfdf;border-top:1px solid #dfdfdf;border-bottom:1px solid #dfdfdf;border-radius:30px' role='presentation'><tr><td align='center' style='padding:20px;Margin:0;font-size:0px'><img class='adapt-img' src='https://gdlcba.stripocdn.email/content/guids/CABINET_9d3f1fbd678ee43b7ee7295e55fe80972aae4126af2c5050c649e608e0b19198/images/3293465.jpg' alt='Invite your friends ' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border-radius:20px;font-size:12px' width='520' title='Invite your friends '></td></tr></table></td></tr></table></td></tr><tr><td align='left' style='Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px'><table cellspacing='0' cellpadding='0' width='100%' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'><tr><td class='es-m-p0r' valign='top' align='center' style='padding:0;Margin:0;width:560px'><table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'><tr><td align='center' style='padding:0;Margin:0'><h1 style='Margin:0;line-height:54px;mso-line-height-rule:exactly;font-family: Comic Sans MS, helvetica,arial, sans-serif; font-size:36px;font-style:normal;font-weight:normal;color:#333333'>Hello </h1></td></tr><tr><td align='left' style='Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:30px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family: Comic Sans MS, helvetica,arial, sans-serif; ;line-height:21px;color:#333333;font-size:14px'>You have requested to reset your password.</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family: Comic Sans MS, helvetica,arial, sans-serif; ;line-height:21px;color:#333333;font-size:14px'>Click the button below to change your password:</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family: Comic Sans MS, helvetica,arial, sans-serif; ;line-height:21px;color:#333333;font-size:14px'>Ignore this email if you do remember your password, or you have not made the request.</p><br><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family: Comic Sans MS, helvetica,arial, sans-serif; ;line-height:21px;color:#333333;font-size:14px'><br>Best regards,<br>StarLight Hotel</p></td></tr><tr><td align='center' style='padding:0;Margin:0'><!--[if mso]><a href='' target='_blank' hidden> <v:roundrect xmlns:v='urn:schemas-microsoft-com:vml' xmlns:w='urn:schemas-microsoft-com:office:word' esdevVmlButton href='[[URL]]' style='height:41px; v-text-anchor:middle; width:263px' arcsize='50%' stroke='f' fillcolor='#1acae3'> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family: Comic Sans MS, helvetica,arial, sans-serif; font-size:15px; font-weight:400; line-height:15px; mso-text-raise:1px'>Change your password</center> </v:roundrect></a><![endif]--><!--[if !mso]><!-- --><span class='msohide es-button-border' style='border-style:solid;border-color:#2CB543;background:#1ACAE3;border-width:0px;display:inline-block;border-radius:30px;width:auto;mso-border-alt:10px;mso-hide:all'><a href='[[URL]]' class='es-button' target='_blank' style='mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;display:inline-block;background:#1ACAE3;border-radius:30px;font-family: Comic Sans MS, helvetica,arial, sans-serif; font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;padding:10px 20px 10px 20px'>Change your password</a></span><!--<![endif]--></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding='0' cellspacing='0' class='es-footer' align='center' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top'><tr><td align='center' style='padding:0;Margin:0'><table bgcolor='#ffffff' class='es-footer-body' align='center' cellpadding='0' cellspacing='0' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px'><tr><td align='left' style='padding:20px;Margin:0'><table cellpadding='0' cellspacing='0' width='100%' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'><tr><td align='left' style='padding:0;Margin:0;width:560px'><table cellpadding='0' cellspacing='0' width='100%' role='presentation' style='mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'><tr><td align='center' style='padding:0;Margin:0'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family: Comic Sans MS, helvetica,arial, sans-serif; ;line-height:21px;color:#333333;font-size:14px'>4674 Stony Cloud Trail, Kentucky, Connecticut</p></td></tr><tr><td align='center' style='padding:0;Margin:0;padding-top:10px;padding-bottom:10px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family: Comic Sans MS, helvetica,arial, sans-serif; ;line-height:24px;color:#757279;font-size:12px'><a target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#333333;font-size:12px;line-height:24px' href=''>Privacy</a>&nbsp;| <a target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#333333;font-size:12px;line-height:24px' href=''>Unsubscribe</a>&nbsp;| <a target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#333333;font-size:12px;line-height:24px' href=''>Manage Preferences</a></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div>";

    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message);

    helper.setFrom(fromAddress, senderName);
    helper.setTo(toAddress);
    helper.setSubject(subject);

    content = content.replace("[[URL]]", link);

    helper.setText(content, true);

    mailSender.send(message);
  }

  @Override
  public AuthenticationResponse verify(String verificationCode) {
    User user = userRepo.findByVerificationCode(verificationCode);
    if (user == null || !user.isEnabled()) {
      throw new IllegalArgumentException("Invalid code");
    } else {
      var refresh = RefreshToken.builder().token(jwtService.generateRefreshToken(user))
          .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)).user(user).build();
      refreshTokenRepository.save(refresh);
      var token = jwtService.generateAccessToken(user);
      var refreshToken = jwtService.generateRefreshToken(user);
      user.setVerificationCode(null);
      user.setEnabled(true);
      userRepo.save(user);
      return AuthenticationResponse.builder().accessToken(token).refreshToken(refreshToken).build();
    }
  }

  @Override
  public AuthenticationResponse login(AuthenticationRequest request) {
    authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    var user = userRepository.findByEmail(request.getEmail()).orElseThrow(
        () -> new IllegalArgumentException("User with email " + request.getEmail() + " not found"));
    if (!user.getEnable()) {
      throw new IllegalArgumentException("User is not verified");
    }

    var tokenOpt = refreshTokenRepository.findByUser(user); // take refresh token from db
    if (!tokenOpt.isPresent()) {
      var refresh = RefreshToken.builder().token(jwtService.generateRefreshToken(user))
          .expiration(new Date(System.currentTimeMillis() + 1000 * 60 *
              60))
          .user(user).build();
      refreshTokenRepository.save(refresh);
      String accesToken = jwtService.generateAccessToken(user);
      return AuthenticationResponse.builder().accessToken(accesToken).refreshToken(refresh.getToken())
          .firstName(user.getFirstName()).lastName(user.getLastName()).avatar(user.getAvatar())
          .email(user.getEmail()).build();
    } else {
      var token = tokenOpt.get();
      String newToken = jwtService.generateRefreshToken(user);
      token.setToken(newToken);
      token.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60));
      // 30 days
      refreshTokenRepository.save(token);

      String accesToken = jwtService.generateAccessToken(user);

      return AuthenticationResponse.builder().accessToken(accesToken).refreshToken(newToken)
          .firstName(user.getFirstName()).lastName(user.getLastName()).avatar(user.getAvatar())
          .phone(user.getPhone())
          .email(user.getEmail()).role(user.getRole().toString()).build();
    }
  }

  @Override
  public AuthenticationResponse refreshToken(String rfToken) {

    var tokenOpt = refreshTokenRepository.findRefreshTokenByToken(rfToken);
    User user = tokenOpt.get().getUser();
    if (user == null) {
      return null;
    }

    String token = jwtService.refreshToken(rfToken);
    String accessToken = jwtService.generateAccessToken(user);
    return AuthenticationResponse.builder().accessToken(accessToken).refreshToken(token)
        .firstName(user.getFirstName()).lastName(user.getLastName()).avatar(user.getAvatar())
        .phone(user.getPhone())
        .email(user.getEmail()).role(user.getRole().toString()).build();
  }

  @Override
  public void logout(String rfToken) {
    var tokenOpt = refreshTokenRepository.findRefreshTokenByToken(rfToken);
    refreshTokenRepository.delete(tokenOpt.get());

  }

}
