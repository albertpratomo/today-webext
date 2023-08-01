import type {KeyFilter, OnKeyStrokeOptions} from '@vueuse/core';
import {onKeyStroke as _onKeyStroke} from '@vueuse/core';

export function onKeyStroke(
    key: KeyFilter,
    handler: (event: KeyboardEvent) => void,
    options?: OnKeyStrokeOptions,
) {
    const _handler = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLElement) {
            // If user is typing, don't call the handler.
            if (
                e.target.isContentEditable
                || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
            )
                return;
        }

        handler(e);
    };

    return _onKeyStroke(key, _handler, options ?? {});
}
