// Tutorial: https://developer.chrome.com/docs/extensions/mv3/tut_analytics

const API_SECRET = 'zugTlnEWSA-t2FGoSp-H5g';
const MEASUREMENT_ID = 'G-44GSBY88E1';

const gaUrl = new URL('https://www.google-analytics.com/mp/collect');
gaUrl.searchParams.set('measurement_id', MEASUREMENT_ID);
gaUrl.searchParams.set('api_secret', API_SECRET);

async function getOrCreateClientId(): Promise<string> {
    if (!chrome.storage)
        return 'localhost';

    const result = await chrome.storage.local.get('clientId');
    let clientId = result.clientId;

    if (!clientId) {
        clientId = globalThis.crypto.randomUUID();

        await chrome.storage.local.set({clientId});
    }

    return clientId;
}

async function getOrCreateSessionId() {
    const SESSION_EXPIRATION_IN_MIN = 30;

    // Store session in memory storage.
    let {sessionData} = await chrome.storage.session.get('sessionData');

    // Check if session exists and is still valid.
    const currentTimeInMs = Date.now();

    if (sessionData && sessionData.timestamp) {
        // Calculate how long ago the session was last updated.
        const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;

        // Check if last update lays past the session expiration threshold.
        if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
            // Delete old session id to start a new session.
            sessionData = null;
        }
        else {
            // Update timestamp to keep session alive.
            sessionData.timestamp = currentTimeInMs;
            await chrome.storage.session.set({sessionData});
        }
    }

    if (!sessionData) {
        // Create and store a new session.
        sessionData = {
            session_id: currentTimeInMs.toString(),
            timestamp: currentTimeInMs.toString(),
        };
        await chrome.storage.session.set({sessionData});
    }

    return sessionData.session_id;
}

// TODO: Maybe store this user email in pinia store.
async function getUserEmail() {
    if (chrome.identity) {
        const {email} = await chrome.identity.getProfileUserInfo({});

        return email;
    }

    return '';
}

const user_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export async function trackGa(name: string, params?: Record<string, any>) {
    fetch(
        gaUrl.href,
        {
            method: 'POST',
            // To be consistent with GA convention, payload should be in snake_case.
            body: JSON.stringify({
                client_id: await getOrCreateClientId(),
                events: [
                    {
                        name,
                        params: {
                            session_id: await getOrCreateSessionId(),
                            engagement_time_msec: 100,
                            user_email: await getUserEmail(),
                            user_timezone,
                            ...params,
                        },
                    },
                ],
            }),
        },
    );
}
