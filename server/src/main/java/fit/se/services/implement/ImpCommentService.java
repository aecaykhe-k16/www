package fit.se.services.implement;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.se.dto.CommentDTO;
import fit.se.models.Comment;
import fit.se.models.Room;
import fit.se.models.User;
import fit.se.repositories.CommentReponsitory;
import fit.se.repositories.RoomRepository;
import fit.se.repositories.UserRepository;
import fit.se.services.ICommentService;
import fit.se.util.HashMapConverter;

@Service
public class ImpCommentService implements ICommentService {
  @Autowired
  private CommentReponsitory commentReponsitory;
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private RoomRepository roomRepository;

  @Autowired
  private ModelMapper modelMapper;

  private CommentDTO convertEntityToDTO(Comment comment) {
    CommentDTO commentDTO = new CommentDTO();
    commentDTO = modelMapper.map(comment, CommentDTO.class);
    commentDTO.setEmail(comment.getUsers().getEmail());
    commentDTO.setRoom_ID(comment.getRooms().getRoom_ID());
    return commentDTO;

  }

  @Override
  public List<Map<String, Object>> getAllComment() {
    List<CommentDTO> list = commentReponsitory.findAll().stream().map(this::convertEntityToDTO)
        .collect(Collectors.toList());

    List<Map<String, Object>> rs = new ArrayList<>();

    for (CommentDTO commentDTO : list) {
      Map<String, Object> map = HashMapConverter.toHashMap(commentDTO);
      map.put("createdAt", commentDTO.getCreatedAt().toString().split(" ")[0].replace("-", "/"));
      rs.add(map);
    }

    return rs;
  }

  @Override
  public List<Map<String, Object>> getCommentByRoomID(String roomID) {
    List<CommentDTO> list = commentReponsitory.getCommentByRoomId(roomID).stream().map(this::convertEntityToDTO)
        .collect(Collectors.toList());

    List<Map<String, Object>> rs = new ArrayList<>();
    for (CommentDTO commentDTO : list) {
      Map<String, Object> map = HashMapConverter.toHashMap(commentDTO);
      map.put("createdAt", commentDTO.getCreatedAt().toString().split(" ")[0].replace("-", "/"));
      rs.add(map);
    }
    return rs;
  }

  @Override
  public List<CommentDTO> getCommentByUserID(String userID) {
    return commentReponsitory.getCommentByUserId(userID).stream().map(this::convertEntityToDTO)
        .collect(Collectors.toList());
  }

  @Override
  public boolean addComment(CommentDTO commentDTO) {
    User user = userRepository.findByEmail(commentDTO.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));
    Room room = roomRepository.findById(commentDTO.getRoom_ID()).get();
    if (user != null && room != null) {
      Comment comment = new Comment();
      comment.setComment(commentDTO.getComment());
      comment.setImage(commentDTO.getImage());
      comment.setPoint(commentDTO.getPoint());
      comment.setCreatedAt(new Date());
      comment.setUsers(user);
      comment.setRooms(room);
      commentReponsitory.save(comment);
      return true;
    }
    return false;
  }
}
