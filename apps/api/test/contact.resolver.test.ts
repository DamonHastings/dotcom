import 'reflect-metadata';
import { AppTestFactory } from './utils/app-test.factory';

describe('ContactResolver (submitLead)', () => {
  let factory: AppTestFactory;

  beforeAll(async () => {
    factory = await new AppTestFactory().init();
  });

  afterAll(async () => {
    await factory.close();
  });

  it('creates a lead and returns the id and email', async () => {
    const query = `mutation SubmitLead($input: SubmitLeadInput!) { submitLead(input: $input) { id email name createdAt } }`;
    const variables = {
      input: { name: 'Test Lead', email: 'test-lead@example.com', message: 'Hi from tests' },
    };

    const res = await factory.gql(query, variables);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data.submitLead');
    const lead = res.body.data.submitLead;
    expect(lead.email).toBe('test-lead@example.com');
    expect(lead.id).toBeTruthy();
  }, 20000);
});
