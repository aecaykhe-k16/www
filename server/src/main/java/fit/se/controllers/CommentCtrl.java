package fit.se.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.se.dto.CommentDTO;
import fit.se.exceptions.ResponeMessage;
import fit.se.services.ICommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CommentCtrl {

  @Autowired
  private ICommentService commentService;

  @GetMapping(value = {
      "", "/"
  })
  public ResponseEntity<ResponeMessage> getAllComment() {
    try {
      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", commentService.getAllComment()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @PostMapping(value = {
      "", "/add"
  }, consumes = {
      "application/json",
      "application/x-www-form-urlencoded"
  })
  public ResponseEntity<ResponeMessage> addComment(@RequestBody CommentDTO commentDTO) {
    try {

      commentService.addComment(commentDTO);

      return ResponseEntity.status(HttpStatus.OK).body(new ResponeMessage("ok", "success", null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<ResponeMessage> getRoomById(@PathVariable String roomId) {
    try {

      return ResponseEntity.status(HttpStatus.OK)
          .body(new ResponeMessage("ok", "success", commentService.getCommentByRoomID(roomId)));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ResponeMessage("error", "Not found", e.getMessage()));
    }
  }

}
