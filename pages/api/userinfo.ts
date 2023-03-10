import { getToken } from 'next-auth/jwt';

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const getDataFromUserInfo = (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const userInfoEndpoint = `${process.env.ZITADEL_ISSUER}/oidc/v1/userinfo`;

  return fetch(userInfoEndpoint, {
    headers: {
      Authorization: token,
      'content-type': 'application/json',
    },
    method: 'GET',
  })
    .then((resp) => resp.json())
    .then((resp) => {
      const scope = 'urn:zitadel:iam:org:project:roles';
      const roles = resp[scope];

      return res.send(roles);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  if (!token?.accessToken) {
    return res.status(401).end();
  }

  switch (req.method) {
    case 'GET':
      return getDataFromUserInfo(req, res, token.accessToken);
    default:
      return res.status(405).end();
  }
};

export default handler;
