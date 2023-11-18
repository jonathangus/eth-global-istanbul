import axios from 'axios';
import {
  TSignedRequest,
  TurnkeyClient,
  createActivityPoller,
} from '@turnkey/http';
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

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  let signedRequest = body as TSignedRequest;

  try {
    const activityResponse = await axios.post(
      signedRequest.url,
      JSON.parse(signedRequest.body),
      {
        headers: {
          [signedRequest.stamp.stampHeaderName]:
            signedRequest.stamp.stampHeaderValue,
        },
      }
    );

    if (activityResponse.status !== 200) {
      return NextResponse.json(
        {
          ok: false,
          message: `expected 200, got ${activityResponse.status}`,
        },
        { status: 500 }
      );
    }

    const stamper = new ApiKeyStamper({
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
    });
    const client = new TurnkeyClient(
      { baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL! },
      stamper
    );
    console.log({ stamper, client });
    const activityPoller = createActivityPoller({
      client: client,
      requestFn: client.getActivity,
    });

    const activityId = refineNonNull(activityResponse.data.activity?.id);
    const subOrgId = refineNonNull(
      activityResponse.data.activity?.organizationId
    );
    console.log({ activityId, subOrgId });
    const completedActivity = await activityPoller({
      activityId,
      organizationId: subOrgId,
    });
    console.log({ activityId, subOrgId });

    const privateKeys =
      completedActivity.result.createPrivateKeysResultV2?.privateKeys;

    // XXX: sorry for the ugly code! We expect a single key / address returned.
    // If we have more than one key / address returned, or none, this would break.
    const address = privateKeys
      ?.map((pk) => pk.addresses?.map((addr) => addr.address).join(''))
      .join('');
    const privateKeyId = privateKeys?.map((pk) => pk.privateKeyId).join('');

    return NextResponse.json(
      {
        message: 'successfully created key',
        address: address,
        privateKeyId: privateKeyId,
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
