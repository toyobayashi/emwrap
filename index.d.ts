import { MinifyOptions } from 'terser';

export declare interface WrapOptions {
  module?: 'umd' | 'esm' | 'cjs' | 'mjs';
  name?: string;
  script?: string;
  onInitScript?: string;
  exports?: string[];
}

export declare interface WrapAndMinifyOptions extends WrapOptions {
  terser?: MinifyOptions;
}

export declare function wrap (code: string, options?: WrapOptions): string;
export declare function wrapAndMinify (code: string, options?: WrapAndMinifyOptions): Promise<string>;
