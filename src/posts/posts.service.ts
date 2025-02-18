import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Comment, Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(post: Pick<Post, 'title' | 'content'>): Promise<Post> {
    return this.prisma.post.create({ data: post });
  }

  findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  findOne(id: Post['id']): Promise<(Post & { comments: Comment[] }) | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: { comments: true },
    });
  }

  update(
    id: Post['id'],
    post: Partial<Pick<Post, 'title' | 'content'>>,
  ): Promise<Post> {
    return this.prisma.post.update({ where: { id }, data: post });
  }

  remove(id: Post['id']) {
    return this.prisma.post.delete({ where: { id } });
  }
}
