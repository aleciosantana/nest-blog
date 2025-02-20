import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @Post()
  create(@Param('postId') id: string, @Body() comment: CreateCommentDto) {
    return this.commentsService.create(+id, comment.text);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() comment: UpdateCommentDto) {
    return this.commentsService.update(+id, comment.text || '');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
