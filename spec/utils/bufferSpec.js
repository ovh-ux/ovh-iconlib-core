'use strict';

const bufferUtils = require('../../lib/utils/buffer');

describe('buffer utils', function() {
    describe('concat', function() {
        it('should success', function() {
            let buffer = bufferUtils.concat(['test']);
            expect(buffer instanceof Buffer).toBe(true);
        });
    });
});