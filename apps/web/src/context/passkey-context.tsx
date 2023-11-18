'use client';
import { PropsWithChildren, useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { getWebAuthnAttestation, TurnkeyClient } from '@turnkey/http';
import { createAccount } from '@turnkey/viem';
import axios from 'axios';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { LocalAccount } from 'viem';
import { useChain } from '../hooks/use-chain';
import { useMutation } from 'wagmi';

const generateRandomBuffer = (): ArrayBuffer => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return arr.buffer;
};

const base64UrlEncode = (challenge: ArrayBuffer): string => {
  return Buffer.from(challenge)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const humanReadableDateTime = (): string => {
  return new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '.');
};

interface PassKeyContext {
  account: any;
}

export const passKeyContext = createContext<PassKeyContext>(
  {} as PassKeyContext
);

export function PassKeyContextProvider({ children }: PropsWithChildren) {
  const { chainId, publicClient } = useChain();
  const [subOrgId, setSubOrgId] = useState<string | null>(null);
  const [privateKeyId, setPrivateKeyId] = useState<string | null>(null);
  const [account, setAccount] = useState<LocalAccount | null>();
  const chainName = publicClient.chain.name;
  const stamper = new WebauthnStamper({
    rpId: 'localhost',
  });

  useEffect(() => {
    setAccount(null);
    setSubOrgId(localStorage.getItem(`subOrgId-${chainName}`));
    setPrivateKeyId(localStorage.getItem(`privateKeyId-${chainName}`));
  }, [chainId]);

  const passkeyHttpClient = new TurnkeyClient(
    {
      baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
    },
    stamper
  );

  const createPrivateKey = async (organizationId: string) => {
    if (!organizationId) {
      return;
    }

    const signedRequest = await passkeyHttpClient.stampCreatePrivateKeys({
      type: 'ACTIVITY_TYPE_CREATE_PRIVATE_KEYS_V2',
      organizationId,
      timestampMs: String(Date.now()),
      parameters: {
        privateKeys: [
          {
            privateKeyName: `ETH Key ${Math.floor(Math.random() * 1000)}`,
            curve: 'CURVE_SECP256K1',
            addressFormats: ['ADDRESS_FORMAT_ETHEREUM'],
            privateKeyTags: [],
          },
        ],
      },
    });

    const response = await axios.post('/api/turnkey/create-key', signedRequest);

    setPrivateKeyId(response.data['privateKeyId']);

    window.localStorage.setItem(
      `privateKeyId-${chainName}`,
      response.data['privateKeyId']
    );
  };

  const createSubOrg = async () => {
    const challenge = generateRandomBuffer();
    const subOrgName = `ETHGlobal Instanbul - ${chainName} -  ${humanReadableDateTime()}`;
    const authenticatorUserId = generateRandomBuffer();

    const attestation = await getWebAuthnAttestation({
      publicKey: {
        rp: {
          id: 'localhost',
          name: 'Turnkey Viem Passkey Demo',
        },
        challenge,
        pubKeyCredParams: [
          {
            type: 'public-key',
            // All algorithms can be found here: https://www.iana.org/assignments/cose/cose.xhtml#algorithms
            // Turnkey only supports ES256 at the moment.
            alg: -7,
          },
        ],
        user: {
          id: authenticatorUserId,
          name: subOrgName,
          displayName: subOrgName,
        },
      },
    });
    const res = await axios.post('/api/turnkey/create-sub-org', {
      subOrgName: subOrgName,
      attestation,
      challenge: base64UrlEncode(challenge),
    });

    setSubOrgId(res.data.subOrgId);

    window.localStorage.setItem(`subOrgId-${chainName}`, res.data.subOrgId);

    createPrivateKey(res.data.subOrgId);
  };

  const _login = async () => {
    if (!privateKeyId || !subOrgId) {
      return console.log({ privateKeyId, subOrgId }, 'missing');
    }
    const { privateKey } = await passkeyHttpClient.getPrivateKey({
      organizationId: subOrgId,
      privateKeyId,
    });
    const viemAccount = await createAccount({
      client: passkeyHttpClient,
      organizationId: subOrgId,
      privateKeyId: privateKey.privateKeyId,
      ethereumAddress: privateKey.addresses[0]?.address,
    });

    setAccount(viemAccount);
  };

  const { mutate: login, isLoading: isLoggingIn } = useMutation(async () =>
    _login()
  );

  const { mutate: register, isLoading: isRegistering } = useMutation(async () =>
    createSubOrg()
  );

  const value = {
    login,
    isLoggingIn,
    register,
    isRegistering,
    account,
    privateKeyId,
  };

  return (
    <passKeyContext.Provider value={value}>{children}</passKeyContext.Provider>
  );
}

export const usepassKeyContext = () => useContext(passKeyContext);
