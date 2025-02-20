import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const commentsServiceMock = {
  create: jest.fn().mockResolvedValue({ id: 1, text: 'Test comment' }),
  update: jest.fn().mockResolvedValue({ id: 1, text: 'Updated comment' }),
  remove: jest.fn().mockResolvedValue({}),
};

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: commentsServiceMock }],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a comment', async () => {
    const dto: CreateCommentDto = { text: 'Test comment' };
    const result = await controller.create('1', dto);
    expect(result).toEqual({ id: 1, text: 'Test comment' });
    expect(commentsServiceMock.create).toHaveBeenCalledWith(1, dto.text);
  });

  it('should update a comment', async () => {
    const dto: UpdateCommentDto = { text: 'Updated comment' };
    const result = await controller.update('1', dto);
    expect(result).toEqual({ id: 1, text: 'Updated comment' });
    expect(commentsServiceMock.update).toHaveBeenCalledWith(1, dto.text);
  });

  it('should remove a comment', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({});
    expect(commentsServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
