vi.mock('webextension-polyfill', () => {
    return {};
});

vi.mock('~/utils/googleAnalytics.ts', () => {
    return {
        trackGa: vi.fn(),
    };
});
