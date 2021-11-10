export declare interface EmwrapOptions {
  filePath: string
  module?: 'umd' | 'esm'
  outputPath?: string
  libName?: string
  wrapScript?: string
  minify?: boolean
  exportsOnInit?: string[]
}

export declare function emwrap (options?: EmwrapOptions): Promise<void>;
