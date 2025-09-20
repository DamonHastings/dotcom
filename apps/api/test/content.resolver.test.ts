import { AppTestFactory } from './utils/app-test.factory';

const PROJECTS_QUERY = `#graphql
query Projects { projects { slug title } }`;

describe('ContentResolver (e2e)', () => {
  const factory = new AppTestFactory();
  beforeAll(async () => { await factory.init(); });
  afterAll(async () => { await factory.close(); });

  it('returns project list', async () => {
    const res = await factory.gql(PROJECTS_QUERY);
    expect(res.body.errors).toBeUndefined();
    expect(Array.isArray(res.body.data.projects)).toBe(true);
  });
});
