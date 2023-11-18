import { TurnkeyApiTypes, TurnkeyClient } from '@turnkey/http';
import { createActivityPoller } from '@turnkey/http';
import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { NextRequest, NextResponse } from 'next/server';

function refineNonNull<T>(
  input: T | null | undefined,
  errorMessage?: string
): T {
  if (input == null) {
    throw new Error(errorMessage ?? `Unexpected ${JSON.stringify(input)}`);
  }

  return input;
}
type TAttestation = TurnkeyApiTypes['v1Attestation'];

type CreateSubOrgWithPrivateKeyRequest = {
  subOrgName: string;
  challenge: string;
  privateKeyName: string;
  attestation: TAttestation;
};

type CreateSubOrgResponse = {
  subOrgId: string;
  privateKeyId: string;
  privateKeyAddress: string;
};

type ErrorMessage = {
  message: string;
};

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const createSubOrgRequest = body as CreateSubOrgWithPrivateKeyRequest;

  console.log({
    body,
    apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
    apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY,
    baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL,
    NEXT_PUBLIC_ORGANIZATION_ID: process.env.NEXT_PUBLIC_ORGANIZATION_ID,
  });
  try {
    const turnkeyClient = new TurnkeyClient(
      { baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL! },
      new ApiKeyStamper({
        apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
        apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      })
    );

    const activityPoller = createActivityPoller({
      client: turnkeyClient,
      requestFn: turnkeyClient.createSubOrganization,
    });

    const privateKeyName = `Default ETH Key`;

    const completedActivity = await activityPoller({
      type: 'ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V3',
      timestampMs: String(Date.now()),
      organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
      parameters: {
        subOrganizationName: createSubOrgRequest.subOrgName,
        rootQuorumThreshold: 1,
        rootUsers: [
          {
            userName: 'New user',
            apiKeys: [],
            authenticators: [
              {
                authenticatorName: 'Passkey',
                challenge: createSubOrgRequest.challenge,
                attestation: createSubOrgRequest.attestation,
              },
            ],
          },
        ],
        privateKeys: [
          {
            privateKeyName: privateKeyName,
            curve: 'CURVE_SECP256K1',
            addressFormats: ['ADDRESS_FORMAT_ETHEREUM'],
            privateKeyTags: [],
          },
        ],
      },
    });

    console.log('hERE');
    const subOrgId = refineNonNull(
      completedActivity.result.createSubOrganizationResultV3?.subOrganizationId
    );
    const privateKeys = refineNonNull(
      completedActivity.result.createSubOrganizationResultV3?.privateKeys
    );
    const privateKeyId = refineNonNull(privateKeys?.[0]?.privateKeyId);
    const privateKeyAddress = refineNonNull(
      privateKeys?.[0]?.addresses?.[0]?.address
    );

    return NextResponse.json(
      {
        subOrgId,
        privateKeyId,
        privateKeyAddress,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        ok: false,
        message: `Something went wrong, caught error: ${e}`,
      },
      { status: 500 }
    );
  }
}
