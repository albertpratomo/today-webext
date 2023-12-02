const API_SECRET = 'zugTlnEWSA-t2FGoSp-H5g';
const MEASUREMENT_ID = 'G-44GSBY88E1';

const gaUrl = new URL('https://www.google-analytics.com/mp/collect');
gaUrl.searchParams.set('measurement_id', MEASUREMENT_ID);
gaUrl.searchParams.set('api_secret', API_SECRET);

async function getOrCreateClientId(): Promise<string> {
    const result = await chrome.storage.local.get('clientId');
    let clientId = result.clientId;

    if (!clientId) {
        clientId = globalThis.crypto.randomUUID();

        await chrome.storage.local.set({clientId});
    }

    return clientId;
}

const client_id = await getOrCreateClientId();

// TODO: Maybe store this user email in pinia store.
let user_email = '';
await chrome.identity.getProfileUserInfo(({email}) => {
    user_email = email;
});

export async function trackGa(name: string, params?: Record<string, any>) {
    fetch(
        gaUrl.href,
        {
            method: 'POST',
            // To be consistent with GA convention, payload should be in snake_case.
            body: JSON.stringify({
                client_id,
                events: [
                    {
                        name,
                        params: {
                            user_email,
                            ...params,
                        },
                    },
                ],
            }),
        },
    );
}
