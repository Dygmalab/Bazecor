import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [],
	root: 'src',
  test: {
		coverage: {
			// exclude: ['**/*.{system,perf,stress}.ts']
		},
		include: [
			// '**/*.{system,perf,stress}.ts',
			'**/*.{spec,test,unit,accept,integrate}.ts'
		]
	}
});
