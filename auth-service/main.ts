import 'source-map-support/register';

const { USER_PASSWORD } = process.env;

const generatePolicy = (principalId, effect, resource) => {
  if (!effect || !resource) {
    return { principalId }
  }

  return {
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
    }
  };
}

export const auth = async (event) => {
  console.log('event', event);

  if (event.type !== 'TOKEN') {
    return 'Unauthorized';
  }

  const { authorizationToken, methodArn } = event;

  if (!authorizationToken) {
    return 'Unauthorized';
  }

  const [authScheme, token] = authorizationToken.split(' ');

  if (!(authScheme.toLowerCase() === 'basic' && token)) {
    return 'Unauthorized';
  }

  try {
    const buffer = Buffer.from(token, 'base64');
    const [,password] = buffer.toString('utf-8').split(':');

    const effect = USER_PASSWORD !== password ? 'Deny' : 'Allow';

    return generatePolicy(token, effect, methodArn);
  } catch (e) {
    console.error(`Catch error. Invalid token: ${e.message}`);

    return 'Unauthorized';
  }
};
