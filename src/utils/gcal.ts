import {useFetch} from '@vueuse/core';

const CLIENT_ID = '1021613980165-d9mpvhig4v3i86eb4656j4p135ruedoi.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export async function fetchAuthCode(): Promise<string> {
    // `chrome.identity.getAuthToken` didn't work in Arc. This is a work-around
    // using `chrome.identity.launchWebAuthFlow`, as explained in
    // https://github.com/GoogleChrome/developer.chrome.com/issues/7434
    const url = new URL('https://accounts.google.com/o/oauth2/auth');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('scope', SCOPES.join(' '));
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

export async function revokeToken(token: string) {
    const url = new URL('https://oauth2.googleapis.com/revoke');
    url.searchParams.set('token', token);

    return await useFetch(url.href).post().json();
}
