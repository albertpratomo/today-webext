vi.mock('webextension-polyfill', () => {
    return {
        action: {
            setBadgeBackgroundColor: vi.fn(),
            setBadgeText: vi.fn(),
            setBadgeTextColor: vi.fn(),
        },
    };
});
