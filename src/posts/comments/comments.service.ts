import { Injectable } from '@nestjs/common';
import { Comment, Post } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  create(postId: Post['id'], text: string): Promise<Comment> {
    return this.prisma.comment.create({ data: { text, postId } });
  }

  update(id: Comment['id'], text: string): Promise<Comment> {
    return this.prisma.comment.update({ where: { id }, data: { text } });
  }

  remove(id: Comment['id']) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
