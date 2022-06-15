import { MinifyOptions } from 'terser';

export declare interface WrapOptions {
  worker?: boolean;
  module?: 'umd' | 'esm' | 'cjs' | 'mjs';
  name?: string;
  weixin?: boolean;
  script?: string;
  onInitScript?: string;
  exports?: string[];
}

export declare interface WrapAndMinifyOptions extends WrapOptions {
  terser?: MinifyOptions;
}

export declare function wrap (code: string, options?: WrapOptions): string;
export declare function wrapWorker (code: string, options?: Omit<WrapOptions, 'script' | 'onInitScript' | 'exports' | 'weixin'>): string;
export declare function wrapAndMinify (code: string, options?: WrapAndMinifyOptions, f?: (code: string, options?: any) => string): Promise<string>;
