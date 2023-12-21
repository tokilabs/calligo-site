import { isString } from './is';

/**
 * Represents a sequence with all option fields set as required.
 */
export type IdSequence = {
  /**
   * The name of the sequence
   */
  name: string;

  /**
   * The next id number of the sequence.
   */
  next: number;

  /**
   * The prefix of generated ids.
   */
  prefix: string;
};

/**
 * Configuration settings required when initializing a new sequence.
 * These settings are only applied when creating a sequence that does not already exist.
 */
export type NewIdSequenceOptions = {
  /**
   * The unique identifier for the sequence.
   */
  name: string;

  /**
   * The initial starting number of the sequence. Defaults to `1`.
   *
   * @default 1
   */
  next?: number;

  /**
   * The string to prepend to the generated id. Defaults to an empty string.
   *
   * @default ''
   */
  prefix?: string;

  /**
   * Whether to throw an error if a sequence with the same name already exists.
   * Defaults to `false`.
   *
   * @default false
   */
  throwIfAlreadyExists?: boolean;
};

/**
 * A signature for a function that generates sequential identifiers.
 *
 * Overloads:
 * - Without arguments, generates the next id in the default sequence.
 * - With a `sequence` name string, generates the next id for that sequence and initializes it if it does not exist.
 * - With a `NewIdSequenceOptions` object, generates the next id for the sequence and initializes it with the provided options.
 *
 * In any of these cases, the sequence will start at `1` if it is being created, unless otherwise specified in `NewIdSequenceOptions`.
 *
 * @typedef {function} NextIdFunction
 * @property {boolean} debug - If `true`, prints the id counters to console log whenever `nextId` is called.
 */
export type NextIdFunction = {
  /**
   * Generates the next id in the default sequence
   */
  (): string;

  /**
   * Generates the next id for the named `sequence`
   *
   * If a sequence with that name does not exist, one will
   * be created with first id starting at `1` and no `prefix`
   */
  (sequence?: string): string;

  /**
   * Generates the next id for the specified `sequence`
   *
   * If a sequence with that name does not exist, one will
   * be created with the `sequence.next` and `sequence.prefix`,
   * if specified.
   *
   */
  (sequence?: NewIdSequenceOptions): string;

  /**
   * When true, prints the id counters every time nextId is called
   *
   * @default false
   */
  debug: boolean;
};

/**
 * The underlying implementation of the exposed `nextId` function with access to private state.
 *
 * @interface NextIdPrivate
 * @property {Record<symbol | string, Sequence>} counters - The map of sequence names to their respective counter information.
 * @extends {NextIdFunction}
 */
interface NextIdPrivate extends NextIdFunction {
  counters: Record<symbol | string, IdSequence>;
}

const _nextId: NextIdPrivate = ((
  sequence?: string | NewIdSequenceOptions,
): string => {
  // Ensure the debug property and counters are initialized
  _nextId.debug ??= false;
  _nextId.counters ??= {} as Record<string, IdSequence>;

  const debug = (...args) => _nextId.debug && console.log('[nextId]', ...args);

  // Determine the sequence name
  const name = isString(sequence) ? sequence : sequence?.name ?? '';

  // Retrieve the existing sequence or create a new one with the provided options
  const seq: IdSequence = _nextId.counters[name] ?? {
    name,
    next: 1,
    prefix: '',
    ...(isString(sequence) ? {} : sequence),
  };

  if (name in _nextId.counters) {
    // Sequence exists; check whether to throw an error
    if ((sequence as any)?.throwIfAlreadyExists) {
      throw new Error(`Sequence ${name} already exists.`);
    }
  } else {
    // Save the newly created sequence
    debug(`Creating sequence ${name}:`, seq);
    _nextId.counters[name] = seq;
  }

  // Increment the sequence's counter and generate the next id
  const nextIdValue = seq.next++;
  const nextIdString = `${seq.prefix}${nextIdValue}`;

  // debug log the sequence's operation
  debug(sequence, '=>>', nextIdString);

  return nextIdString;
}) as NextIdPrivate;

/**
 * A function that generates sequential ids.
 *
 * You can have separate sequences by passing the sequence name
 * in the `sequence` parameter. If a sequence with that name does
 * not exist yet, a counter for it will be initiated at `1`.
 *
 * @param group The group of ids to prepend to the next id number
 * @type function
 */
export const nextId: NextIdFunction = _nextId;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('nextId source tests', () => {
    expect(nextId(), '1');
    expect(nextId('seq'), '1');
    expect(
      nextId({
        name: 'seq',
        next: 100,
        prefix: 'seq',
      }),
      '2',
    );

    const seq101 = {
      name: 'seq',
      next: 101,
      prefix: 'seq-',
    };

    expect(nextId(seq101), 'seq-101');
    expect(nextId(seq101), 'seq-102');
  });
}
