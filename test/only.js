import test from '../index.js';

test.only('should not be skipped', () => {});

test('should be skipped', () => {});

test.only('should not be skipped', () => {});

test('should be skipped', () => {});
