import test from '../index.js';

test('should not be skipped', () => {});

test.skip('should be skipped', () => {});

test.skip('should be skipped', () => {});

test('should not be skipped', () => {});
