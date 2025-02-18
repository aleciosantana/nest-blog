import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '@prisma/client';

const fixedDate = new Date('2024-01-01T00:00:00.000Z');

const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  content: 'This is a test post',
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

const mockPostsService = {
  create: jest.fn().mockResolvedValue(mockPost),
  findAll: jest.fn().mockResolvedValue([mockPost]),
  findOne: jest.fn().mockResolvedValue(mockPost),
  update: jest.fn().mockResolvedValue(mockPost),
  remove: jest.fn().mockResolvedValue(mockPost),
};

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call PostsService.create and return a post', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'This is a test post',
    };

    const result = await controller.create(createPostDto);

    expect(result).toEqual(mockPost);
    expect(mockPostsService.create).toHaveBeenCalledWith(createPostDto);
  });

  it('should call PostsService.findAll and return all posts', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockPost]);
    expect(mockPostsService.findAll).toHaveBeenCalled();
  });

  it('should call PostsService.findOne and return a post by id', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockPost); // Esperando o mockPost como retorno
    expect(mockPostsService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call PostsService.findOne and return null if not found', async () => {
    mockPostsService.findOne.mockResolvedValueOnce(null); // Caso não encontre
    const result = await controller.findOne('999');
    expect(result).toBeNull(); // Esperando que retorne null
    expect(mockPostsService.findOne).toHaveBeenCalledWith(999);
  });

  it('should call PostsService.update and update a post', async () => {
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Title',
      content: 'Updated content',
    };

    const result = await controller.update('1', updatePostDto);
    expect(result).toEqual(mockPost);
    expect(mockPostsService.update).toHaveBeenCalledWith(1, updatePostDto);
  });

  it('should call PostsService.remove and delete a post', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual(mockPost);
    expect(mockPostsService.remove).toHaveBeenCalledWith(1);
  });
});
