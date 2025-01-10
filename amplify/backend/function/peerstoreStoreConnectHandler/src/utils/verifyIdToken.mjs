import { CognitoJwtVerifier } from 'aws-jwt-verify'

const { AUTH_PEERSTOREA570DC98_USERPOOLID } = process.env;

export default async function verifyIdToken({
  clientId='',
  token='',
}={}) {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: AUTH_PEERSTOREA570DC98_USERPOOLID,
    tokenUse: 'id', // 'id': idToken, 'access': accessToken
    clientId,
  })

  const payload = await verifier.verify(token)

  // payload = {
  //   sub: 'e7949a18-d021-7026-d451-65ea5afaa28c',
  //   email_verified: true,
  //   iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_YbkLQGaU2',
  //   'cognito:username': 'e7949a18-d021-7026-d451-65ea5afaa28c',
  //   origin_jti: 'e161bebf-2bd9-4351-9596-58ed7dd5bcc9',
  //   aud: '78o34531d01e4q6imp6ujn099l',
  //   event_id: 'd13962ff-0bee-4bbb-a2d9-03dc1c1214ff',
  //   token_use: 'id',
  //   auth_time: 1736236862,
  //   exp: 1736742030,
  //   iat: 1736738430,
  //   jti: 'f7e2f02d-97d9-4ef0-abed-ee96e15eb5e9',
  //   email: 'aaa@test.com'
  // }

  return payload
}
