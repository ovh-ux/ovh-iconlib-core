'use strict';

const svgUtils = require('../../lib/utils/svg');

describe('svg utils', function() {
    describe('get viewport', function() {
        it('should success', function() {
            let w; 
            let h; 

            [w, h] = svgUtils.viewport.get('<svg></svg>');
            expect(w).toBe(null);
            expect(h).toBe(null);

            [w, h] = svgUtils.viewport.get('<svg width="32" height="16"></svg>');
            expect(w.length).toBe('32');
            expect(h.length).toBe('16');
        });
    });
});