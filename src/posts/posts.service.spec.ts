import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Comment } from '@prisma/client';

const fixedDate = new Date('2024-01-01T00:00:00.000Z');

const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  content: 'This is a test post',
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

const mockUpdatedPost: Post = {
  id: 1,
  title: 'Updated Title',
  content: 'Updated content',
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

const mockPostWithComments: Post & { comments: Comment[] } = {
  ...mockPost,
  comments: [
    {
      id: 1,
      text: 'Test Comment',
      postId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

const prismaMock = {
  post: {
    findMany: jest.fn().mockResolvedValue([mockPost]),
    findUnique: jest
      .fn()
      .mockImplementation(({ where: { id } }) =>
        Promise.resolve(id === 1 ? mockPostWithComments : null),
      ),
    create: jest.fn().mockResolvedValue(mockPost),
    update: jest.fn().mockResolvedValue(mockUpdatedPost),
    delete: jest.fn().mockResolvedValue(mockPost),
  },
};

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const result = await service.create({
      title: mockPost.title,
      content: mockPost.content,
    });

    expect(result).toEqual(mockPost);
    expect(prismaMock.post.create).toHaveBeenCalledWith({
      data: { title: mockPost.title, content: mockPost.content },
    });
  });

  it('should return all posts', async () => {
    const result = await service.findAll();

    expect(result).toEqual([mockPost]);
    expect(prismaMock.post.findMany).toHaveBeenCalled();
  });

  it('should return a post with comments if found', async () => {
    const result = await service.findOne(1);

    expect(result).toEqual(mockPostWithComments);
    expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { comments: true },
    });
  });

  it('should return null if post is not found', async () => {
    const result = await service.findOne(999);

    expect(result).toBeNull();
    expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: { comments: true },
    });
  });

  it('should update a post', async () => {
    const result = await service.update(1, {
      title: 'Updated Title',
      content: 'Updated content',
    });

    expect(result).toEqual(mockUpdatedPost);
    expect(prismaMock.post.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { title: 'Updated Title', content: 'Updated content' },
    });
  });

  it('should delete a post', async () => {
    const result = await service.remove(1);

    expect(result).toEqual(mockPost);
    expect(prismaMock.post.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
