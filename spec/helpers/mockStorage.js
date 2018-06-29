/**
 * Copyright (c) 2013-2018, OVH SAS.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the name of OVH SAS nor the
 *     names of its contributors may be used to endorse or promote products
 *     derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY OVH SAS AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL OVH SAS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const util = require('util');
const Base = require('ovh-iconlib-provider-storage/lib/base');

let MockStorageProvider = function MockStorageProvider(config) {
    MockStorageProvider.super_.call(this, config);
};

util.inherits(MockStorageProvider, Base);

MockStorageProvider.prototype.upload = function(stream, options) {
    if (options.name === 'error.txt') {
        return Promise.reject(new Error('mock error'));
    }

    return Promise.resolve({});
};

MockStorageProvider.prototype.list = function(path, skip, take) {
    skip = skip || 0;
    take = take || 10;
    return Promise.resolve([{
        name: 'test.svg',
        container: 'my-test',
        client: {
            _serviceUrl: 'https://url'
        }
    }].slice(skip, take + skip));
};

MockStorageProvider.prototype.remove = function(filename) {
    if (filename === 'error.txt') {
        return Promise.reject(new Error('mock error'));
    }

    return Promise.resolve(true);
};

module.exports = MockStorageProvider;
