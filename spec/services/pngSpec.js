'use strict';

const stream = require('stream');
const PngService = require('../../lib/services/png');
const SvgService = require('../../lib/services/svg');

describe('PngService', function() {
    describe('instantiation', function() {
        describe('without SvgService', function() {
            it('should instantiate a default SvgService', function() {
                let pngService = new PngService();
                expect(pngService.svgService instanceof SvgService).toBe(true);
            });
        });

        describe('with invalid SvgService', function() {
            it('should throw an Error', function() {
                expect(function() {
                    new PngService({});
                }).toThrowError();
            });
        });

        describe('with valid SvgService', function() {
            it('should success', function() {
                let svgService = new SvgService();
                let pngService = new PngService(svgService);
                expect(pngService.svgService).toBe(svgService);
            });
        });
    });

    describe('generation from', function() {
        describe('valid svg', function() {
            it('should success', function(done) {
                let file = stream.PassThrough();
                let pngService = new PngService();
                spyOn(pngService.svgService.storage, 'download').and.returnValue(file);
                file.end('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><defs><style>.cls-3{stroke:#122844;stroke-linecap:round;stroke-linejoin:round;fill:none}</style></defs><path class="cls-3" d="M9.25.5a6.61 6.61 0 0 0 1.18 1.72 7 7 0 0 0 2.4 1.64 8.06 8.06 0 0 0 3.07.59 8 8 0 0 1 .37.84 30.55 30.55 0 0 1 1.65 6.15 4.92 4.92 0 0 1-1.15 3.45c-.77.81-7.56 4.61-7.56 4.61s-6.81-3.8-7.56-4.61A4.86 4.86 0 0 1 .5 11.47a30.62 30.62 0 0 1 1.65-6.16 8.12 8.12 0 0 1 .37-.85 8.06 8.06 0 0 0 3.07-.59A7 7 0 0 0 8 2.23 6.62 6.62 0 0 0 9.17.5z"/><path class="cls-3" d="M7 18.26a6.48 6.48 0 0 1-2.1-8.77 4.93 4.93 0 0 1 6.8-1.83 4.08 4.08 0 0 1 1.4 5.54 3.16 3.16 0 0 1-4.35 1.17 2.61 2.61 0 0 1-.89-3.54 2 2 0 0 1 2.78-.75 1.67 1.67 0 0 1 .57 2.27 1.29 1.29 0 0 1-1.78.48 1.07 1.07 0 0 1-.37-1.45.83.83 0 0 1 1.14-.31.68.68 0 0 1 .23.93.53.53 0 0 1-.73.2.44.44 0 0 1-.15-.59.34.34 0 0 1 .47-.13.28.28 0 0 1 .1.38"/><path class="cls-3" d="M10.31 11.72a.53.53 0 1 1-.53-.53.53.53 0 0 1 .53.53"/></svg>');
                

                pngService.generateFromSvg('dummy/path')
                    .then(result => {
                        expect(pngService.svgService.storage.download).toHaveBeenCalledWith('dummy/path');
                        done();
                    });
            });
        });

        describe('invalid svg (no viewbox)', function() {
            it('should throw an Error', function(done) {
                let file = stream.PassThrough();
                let pngService = new PngService();
                spyOn(pngService.svgService.storage, 'download').and.returnValue(file);
                file.end('<svg xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-3{stroke:#122844;stroke-linecap:round;stroke-linejoin:round;fill:none}</style></defs><path class="cls-3" d="M9.25.5a6.61 6.61 0 0 0 1.18 1.72 7 7 0 0 0 2.4 1.64 8.06 8.06 0 0 0 3.07.59 8 8 0 0 1 .37.84 30.55 30.55 0 0 1 1.65 6.15 4.92 4.92 0 0 1-1.15 3.45c-.77.81-7.56 4.61-7.56 4.61s-6.81-3.8-7.56-4.61A4.86 4.86 0 0 1 .5 11.47a30.62 30.62 0 0 1 1.65-6.16 8.12 8.12 0 0 1 .37-.85 8.06 8.06 0 0 0 3.07-.59A7 7 0 0 0 8 2.23 6.62 6.62 0 0 0 9.17.5z"/><path class="cls-3" d="M7 18.26a6.48 6.48 0 0 1-2.1-8.77 4.93 4.93 0 0 1 6.8-1.83 4.08 4.08 0 0 1 1.4 5.54 3.16 3.16 0 0 1-4.35 1.17 2.61 2.61 0 0 1-.89-3.54 2 2 0 0 1 2.78-.75 1.67 1.67 0 0 1 .57 2.27 1.29 1.29 0 0 1-1.78.48 1.07 1.07 0 0 1-.37-1.45.83.83 0 0 1 1.14-.31.68.68 0 0 1 .23.93.53.53 0 0 1-.73.2.44.44 0 0 1-.15-.59.34.34 0 0 1 .47-.13.28.28 0 0 1 .1.38"/><path class="cls-3" d="M10.31 11.72a.53.53 0 1 1-.53-.53.53.53 0 0 1 .53.53"/></svg>');
                
                pngService.generateFromSvg('dummy/path')
                    .catch(err => {
                        expect(err.message).toBe('Cannot get dimensions from viewbox !');
                        done();
                    });
            });
        })
    });
});