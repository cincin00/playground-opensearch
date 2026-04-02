import { Test, type TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the service status payload', () => {
      expect(appController.getRoot()).toEqual(
        expect.objectContaining({
          service: 'playground-opensearch',
          status: 'ok',
          timestamp: expect.any(String),
        }),
      );
    });
  });
});
