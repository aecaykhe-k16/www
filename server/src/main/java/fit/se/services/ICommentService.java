package fit.se.services;

import java.util.List;
import java.util.Map;

import fit.se.dto.CommentDTO;

public interface ICommentService {

  List<Map<String, Object>> getAllComment();

  List<Map<String, Object>> getCommentByRoomID(String roomID);

  List<CommentDTO> getCommentByUserID(String userID);

  boolean addComment(CommentDTO commentDTO);
}
