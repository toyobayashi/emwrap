export declare interface WrapOptions {
  module?: 'umd' | 'esm';
  libName?: string;
  wrapScript?: string;
  minify?: boolean;
  exportsOnInit?: string[];
}

export declare function wrap (code: string, options?: WrapOptions): Promise<string>;
