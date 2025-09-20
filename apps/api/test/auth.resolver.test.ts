import { AppTestFactory } from './utils/app-test.factory';

const LOGIN_MUTATION = `#graphql
mutation Login($input: LoginInput!){
  login(input:$input){ accessToken user { id username role } }
}`;

const ME_QUERY = `#graphql
query Me { me { id username role } }`;

describe('AuthResolver (e2e)', () => {
  const factory = new AppTestFactory();
  let token: string;

  beforeAll(async () => { await factory.init(); });
  afterAll(async () => { await factory.close(); });

  it('fails login with wrong creds', async () => {
    const res = await factory.gql(LOGIN_MUTATION, { username: 'wrong', password: 'nope' });
    expect(res.body.errors).toBeDefined();
  });

  it('logs in with correct creds', async () => {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'change_me_local_only';
  const res = await factory.gql(LOGIN_MUTATION, { input: { username, password } });
  expect(res.body.errors).toBeUndefined();
  token = res.body.data.login.accessToken;
    expect(token).toBeDefined();
  });

  it('me query returns current user with auth header', async () => {
    const res = await factory.gql(ME_QUERY).set('Authorization', `Bearer ${token}`);
    expect(res.body.errors).toBeUndefined();
  expect(res.body.data.me.username).toBeDefined();
  });
});
