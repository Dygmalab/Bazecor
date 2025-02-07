import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
	plugins: [],
	root: 'src',
  resolve: {
    alias: [
      { find: "@Renderer", replacement: resolve(__dirname, "./src/renderer") },
      { find: "@Assets", replacement: resolve(__dirname, "./src/static") },
      { find: "@Types", replacement: resolve(__dirname, "./src/renderer/types") },
    ]
  },
  test: {
		coverage: {
      provider: "v8",
			exclude: ['**/*.{spec,test,unit,accept,integrate,system,perf,stress}.{ts,tsx}']
		},
		include: [
			// '**/*.{system,perf,stress}.ts',
			'**/*.{spec,test,unit,accept,integrate}.{ts,tsx}'
		],
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
	}
});
