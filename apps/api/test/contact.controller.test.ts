import { AppTestFactory } from './utils/app-test.factory';

describe('ContactController (e2e)', () => {
  const factory = new AppTestFactory();
  beforeAll(async () => { await factory.init(); });
  afterAll(async () => { await factory.close(); });

  it('rejects invalid body', async () => {
    const res = await factory.http().post('/contact').send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('accepts valid body', async () => {
    const res = await factory.http().post('/contact').send({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Hi',
      message: 'This is a sufficiently long message body for validation.'
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
