'use strict';

const errors = require('rduk-errors');
const services = require('../../lib/services');

const CleanerProvider = require('../helpers/mockSvgCleaner');
const StorageProvider = require('../helpers/mockStorage');

const SVG_DIRTY = 'test';
const SVG_PRISTINE = 'clean';

describe('service', function() {

    describe('svg', function() {

        let service;
        
        beforeEach(function() {
            service = new services.SvgService(
                new CleanerProvider({name: 'cleaner'}),
                new StorageProvider({name: 'storage'})
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
                    }).toThrowError(Error);
                });
            });

            describe('with invalid storage', function() {
                it('should throw an error', function() {
                    expect(function() {
                        new services.SvgService(new CleanerProvider({name: 'cleaner'}), {});
                    }).toThrowError(Error);
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

    });

});
