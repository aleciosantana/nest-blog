import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../../prisma/prisma.service';

const prismaMock = {
  comment: {
    create: jest.fn().mockResolvedValue({ id: 1, text: 'Test comment' }),
    update: jest.fn().mockResolvedValue({ id: 1, text: 'Updated comment' }),
    delete: jest.fn().mockResolvedValue({}),
  },
};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a comment', async () => {
    const result = await service.create(1, 'Test comment');
    expect(result).toEqual({ id: 1, text: 'Test comment' });
    expect(prismaMock.comment.create).toHaveBeenCalledWith({
      data: { text: 'Test comment', postId: 1 },
    });
  });

  it('should update a comment', async () => {
    const result = await service.update(1, 'Updated comment');
    expect(result).toEqual({ id: 1, text: 'Updated comment' });
    expect(prismaMock.comment.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { text: 'Updated comment' },
    });
  });

  it('should remove a comment', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({});
    expect(prismaMock.comment.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
