'use strict';

const stream = require('stream');
const errors = require('@rduk/errors');
const services = require('../../lib/services');

const CustomError = require('../../lib/errors/custom');
const UnprocessableEntityError = require('../../lib/errors/unprocessableEntity');

const CleanerProvider = require('../helpers/mockSvgCleaner');
const StorageProvider = require('../helpers/mockStorage');

const SVG_DIRTY = 'test';
const SVG_PRISTINE = 'clean';

describe('service', function() {

    describe('svg', function() {

        let service;
        
        beforeEach(function() {
            service = new services.SvgService(
                new CleanerProvider({name: 'cleaner', type: CleanerProvider}),
                new StorageProvider({name: 'storage', type: StorageProvider})
            );
        });

        describe('default instantiation', function() {
            it('should load cleaner and storage providers according to the configuration', function() {
                let defaultService = new services.SvgService();
                expect(defaultService.cleaner instanceof CleanerProvider).toBe(true);
                expect(defaultService.storage instanceof StorageProvider).toBe(true);
            });
        });

        describe('instantiation', function() {

            describe('with invalid cleaner', function() {
                it('should throw an error', function() {
                    expect(function() {
                        new services.SvgService({});
                    }).toThrowError(CustomError);
                });
            });

            describe('with invalid storage', function() {
                it('should throw an error', function() {
                    expect(function() {
                        new services.SvgService(new CleanerProvider({name: 'cleaner'}), {});
                    }).toThrowError(CustomError);
                });
            });
            
        });

        describe('method assert, when called,', function() {

            describe('with absent viewbox', function() {
                it('should throw an error', function(done) {
                    service.assert('<svg></svg>')
                        .catch(function(error) {
                            expect(error).toBeDefined();
                            expect(error.statusCode).toBe(422);
                            expect(error instanceof UnprocessableEntityError).toBe(true);
                            done();
                        });
                });
            });


            describe('with valid viewbox', function() {
                it('should success', function(done) {
                    service.assert('<svg viewBox="0 0 10 10"></svg>')
                        .then(function(result) {
                            expect(result).toBeDefined();
                            done();
                        });
                });
            });

        });

        describe('method clean, when called,', function() {

            describe('with empty svg', function() {
                it('should return an empty string', function(done) {
                    service.clean()
                        .then(result => {
                            expect(result).toBe('');
                            done();
                        });
                });
            });

            describe('with valid svg', function() {
                it('should success', function(done) {
                    service.clean(SVG_DIRTY)
                        .then(result => {
                            expect(result).toBe(SVG_PRISTINE);
                            done();
                        });
                });
            });

        });

        describe('method sanitize, when called', function() {
            describe('with valid width and heigtht + present viewBox', function() {
                it('should do nothing', function(done) {
                    service.sanitize('<svg width="32px" height="32px" viewBox="0 0 48 48"></svg>')
                        .then(result => {
                            expect(result).toBe('<svg width="32px" height="32px" viewBox="0 0 48 48"></svg>');
                            done();
                        });
                });
            });

            describe('with valid width and heigtht + absent viewBox', function() {
                it('should do nothing', function(done) {
                    service.sanitize('<svg width="32px" height="32px"></svg>')
                        .then(result => {
                            expect(result).toBe('<svg width="32px" height="32px" viewBox="0 0 32 32"></svg>');
                            done();
                        });
                });
            });
        })

        describe('method store', function() {
            it('should success', function(done) {
                spyOn(service, 'store').and.callThrough();
                service.store('stream', 'test.txt')
                    .then(function(result) {
                        expect(service.store).toHaveBeenCalled();
                        expect(service.store).toHaveBeenCalledWith('stream', 'test.txt');
                        expect(result).toBeDefined();
                        done();
                    });
            });

            it('should failed', function(done) {
                spyOn(service, 'store').and.callThrough();
                service.store('stream', 'error.txt')
                    .catch(function(error) {
                        expect(service.store).toHaveBeenCalled();
                        expect(service.store).toHaveBeenCalledWith('stream', 'error.txt');
                        expect(error).toBeDefined();
                        done();
                    });
            });
        });

        describe('method list', function() {
            it('should success', function(done) {
                spyOn(service, 'get').and.returnValue(Promise.resolve([{name: 'test.svg'}]));
                service.list()
                    .then(function(result) {
                        expect(service.get).toHaveBeenCalled();
                        expect(service.get).toHaveBeenCalledWith('https://url/my-test/test.svg');
                        expect(result && result.length > 0).toBe(true);
                        expect(result[0].name).toBe('test.svg');
                        done();
                    });
            });
        });

        describe('method get', function() {
            it('should success', function(done) {
                service.get('http://example.org/')
                    .then(function(result) {
                        expect(result).toBeDefined();
                        done();
                    });
            });
        });

        describe('method remove', function() {
            it('should success', function(done) {
                service.remove('test.txt')
                    .then(function(result) {
                        expect(result).toBe(true);
                        done();
                    });
            });

            it('should failed', function(done) {
                service.remove('error.txt')
                    .catch(function(error) {
                        expect(error).toBeDefined();
                        done();
                    });
            });
        });

        describe('method zip', function() {
            it('should success', function() {
                let file = stream.PassThrough();
                spyOn(service.storage, 'download').and.returnValue(file);
                file.end('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-3{stroke:#122844;stroke-linecap:round;stroke-linejoin:round;fill:none}</style></defs><path class="cls-3" d="M9.25.5a6.61 6.61 0 0 0 1.18 1.72 7 7 0 0 0 2.4 1.64 8.06 8.06 0 0 0 3.07.59 8 8 0 0 1 .37.84 30.55 30.55 0 0 1 1.65 6.15 4.92 4.92 0 0 1-1.15 3.45c-.77.81-7.56 4.61-7.56 4.61s-6.81-3.8-7.56-4.61A4.86 4.86 0 0 1 .5 11.47a30.62 30.62 0 0 1 1.65-6.16 8.12 8.12 0 0 1 .37-.85 8.06 8.06 0 0 0 3.07-.59A7 7 0 0 0 8 2.23 6.62 6.62 0 0 0 9.17.5z"/><path class="cls-3" d="M7 18.26a6.48 6.48 0 0 1-2.1-8.77 4.93 4.93 0 0 1 6.8-1.83 4.08 4.08 0 0 1 1.4 5.54 3.16 3.16 0 0 1-4.35 1.17 2.61 2.61 0 0 1-.89-3.54 2 2 0 0 1 2.78-.75 1.67 1.67 0 0 1 .57 2.27 1.29 1.29 0 0 1-1.78.48 1.07 1.07 0 0 1-.37-1.45.83.83 0 0 1 1.14-.31.68.68 0 0 1 .23.93.53.53 0 0 1-.73.2.44.44 0 0 1-.15-.59.34.34 0 0 1 .47-.13.28.28 0 0 1 .1.38"/><path class="cls-3" d="M10.31 11.72a.53.53 0 1 1-.53-.53.53.53 0 0 1 .53.53"/></svg>');
                
                let archive = service.zip(['dummy/file/path']);
                expect(service.storage.download).toHaveBeenCalledWith('dummy/file/path');
                expect(archive).toBeDefined();
            });
        });

    });

});
