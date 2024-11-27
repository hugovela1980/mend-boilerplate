import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		setupFiles: './vitest.setup.js',
		environment: 'node',
		coverage: {
			provider: 'v8', // Use V8's built-in coverage tool
			reporter: ['text', 'html'], // Output formats (e.g., text and HTML reports)
			all: true, // Include files that have no tests
			include: [
				'utils/*.js',
				'app/**/controllers/*.js',
				'app/**/middleware/*.js',
				'app/**/services/*.js',
			], // Files to include
			exclude: [
				'node_modules',
				'app/**/controllers/loggerController.js',
				'app/**/middleware/upload.js',
				'app/**/services/mongodbStorageService.js',
			], // Excluded files
		  }
	}
});
