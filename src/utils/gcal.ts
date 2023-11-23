import {useFetch} from '@vueuse/core';

const manifest = chrome.runtime.getManifest();
const CLIENT_SECRET = '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';
const CLIENT_ID = manifest.oauth2!.client_id;
const SCOPES = manifest.oauth2!.scopes!.join(' ');

export async function fetchAuthCode(): Promise<string> {
    // `chrome.identity.getAuthToken` didn't work in Arc. This is a work-around
    // using `chrome.identity.launchWebAuthFlow`, as explained in
    // https://github.com/GoogleChrome/developer.chrome.com/issues/7434
    const url = new URL('https://accounts.google.com/o/oauth2/auth');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('scope', SCOPES);
    url.searchParams.set('redirect_uri', chrome.identity.getRedirectURL());

    const response = await chrome.identity.launchWebAuthFlow({
        interactive: true,
        url: url.href,
    });

    const params = new URLSearchParams(response?.split('?')[1]);

    return params.get('code')!;
}

export async function fetchAccessToken(code: string): Promise<{
    access_token: string
    refresh_token?: string
}> {
    const url = new URL('https://oauth2.googleapis.com/token');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('client_secret', CLIENT_SECRET);
    url.searchParams.set('code', code);
    url.searchParams.set('grant_type', 'authorization_code');
    url.searchParams.set('redirect_uri', chrome.identity.getRedirectURL());

    const {data} = await useFetch(url.href).post().json();

    return data.value;
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
    const url = new URL('https://oauth2.googleapis.com/token');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('client_secret', CLIENT_SECRET);
    url.searchParams.set('grant_type', 'refresh_token');
    url.searchParams.set('refresh_token', refreshToken);

    const {data} = await useFetch(url.href).post().json();

    return data.value.access_token;
}
