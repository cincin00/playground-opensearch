import { Test, type TestingModule } from '@nestjs/testing';

import { AppController } from '../src/app.controller';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('wires the root controller through the application module', () => {
    const appController = moduleFixture.get(AppController);
    const response = appController.getRoot();

    expect(response.service).toBe('playground-opensearch');
    expect(response.status).toBe('ok');
    expect(response.timestamp).toEqual(expect.any(String));
  });
});
