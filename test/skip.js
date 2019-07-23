const test = require('..');

test('should not be skipped', () => {});

test.skip('should be skipped', () => {});

test.skip('should be skipped', () => {});

test('should not be skipped', () => {});
