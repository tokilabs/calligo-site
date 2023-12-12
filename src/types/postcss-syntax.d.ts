// Replace `any` with strict typing if necessary.
export type SyntaxRule =
  | string
  | {
      test: RegExp;
      extract: string;
    };

interface Syntax {
  config: {
    postcss: string | RegExp;
    stylus: string | RegExp;
    babel: string | RegExp;
    xml: string | RegExp;
    rules: SyntaxRule[];
    [key: string]: string | RegExp; // For additional unexpected config values.
  };
  stringify: (document: any) => any;
  parse: (source, opts) => any;
}

// Types for the initSyntax and syntax functions
declare function initSyntax(syntax): Syntax;
declare function syntax(config: Partial<Syntax['config']>): Syntax;

// Declaring a module that reflects the structure of the code
declare module 'postcss-syntax' {
  export = syntax;
}
