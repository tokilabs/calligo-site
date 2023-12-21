import { nextId, type NextIdFunction } from './nextId';
import { describe, expect, it, test, afterEach, vi } from 'vitest';

const _nextId = nextId as NextIdFunction & { counters: any };

describe('nextId function', () => {
  afterEach(() => {
    _nextId.debug = false; // Reset to default after each test
    (<any>_nextId).counters = {}; // Reset counters to ensure clean slate for each test
  });

  it('should generate the nextId without arguments', () => {
    const firstId = _nextId();
    expect(firstId).toBe('1');
    const secondId = _nextId();
    expect(secondId).toBe('2');
  });

  it('should generate the nextId with a sequence name', () => {
    const firstId = _nextId('mySequence');
    expect(firstId).toBe('1');
    const secondId = _nextId('mySequence');
    expect(secondId).toBe('2');
  });

  it('should initialize a new sequence with specified options', () => {
    const options = {
      name: 'newSequence',
      next: 10,
      prefix: 'A-',
      throwIfAlreadyExists: true,
    };
    const firstId = _nextId(options);
    expect(firstId).toBe('A-10');
  });

  it('should throw an error if a sequence with the same name already exists and throwIfAlreadyExists is true', () => {
    const options = { name: 'uniqueSequence', throwIfAlreadyExists: true };
    _nextId(options); // Create the sequence.
    expect(() => {
      _nextId(options); // Try to create it again.
    }).toThrow(Error);
  });

  it('should create a default sequence and then return nextId with prefix', () => {
    const firstId = _nextId();
    expect(firstId).toBe('1');

    _nextId.counters[''] = { name: '', next: 10, prefix: 'B-' };
    const secondId = _nextId();
    expect(secondId).toBe('B-10');
  });

  it('should respect existing sequence next and prefix', () => {
    _nextId.counters['existingSequence'] = {
      name: 'existingSequence',
      next: 5,
      prefix: 'C-',
    };
    const nextIdForExisting = _nextId('existingSequence');
    expect(nextIdForExisting).toBe('C-5');
  });

  it('should print to console if debug is true', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    _nextId.debug = true;

    _nextId('debugSequence');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[nextId]',
      'debugSequence',
      '=>>',
      '1',
    );

    consoleSpy.mockRestore();
  });
});
