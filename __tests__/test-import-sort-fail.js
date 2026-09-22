import { ESLint } from 'eslint';
import { fileURLToPath } from 'url';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');
const importOrderFile = path.join(fixturesDir, 'import-order-only.tsx');

/**
 * simple-import-sort 규칙이 적용되지 않을 때의 실패 사례를 보여줍니다.
 * (simple-import-sort 없이 실행 → 잘못된 import 순서를 감지하지 못함)
 */
async function testImportSortFailure() {
	console.log('🧪 Import 규칙 실패 사례 테스트\n');
	console.log('   (simple-import-sort 없이 실행하여, 잘못된 import 순서를 감지하지 못하는 경우)\n');

	const tempConfigPath = path.join(__dirname, 'temp-eslint-fail.config.js');

	try {
		// simple-import-sort가 없는 최소 설정
		const configCode = `export default [
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: { ecmaFeatures: { jsx: true } },
			globals: { React: 'readonly', useState: 'readonly' },
		},
		rules: {},
	},
];
`;
		await writeFile(tempConfigPath, configCode, 'utf8');

		const eslint = new ESLint({
			overrideConfigFile: tempConfigPath,
		});

		const results = await eslint.lintFiles([importOrderFile]);
		const messages = results[0]?.messages ?? [];
		const importSortErrors = messages.filter(
			(m) => m.ruleId === 'simple-import-sort/imports' || m.ruleId === 'simple-import-sort/exports'
		);

		console.log('   import-order-only.tsx 린트 결과:');
		if (messages.length === 0) {
			console.log('   → 오류 0개 (잘못된 import 순서를 전혀 감지하지 못함)');
		} else {
			messages.forEach((m) => {
				console.log(`   → ${m.line}:${m.column} ${m.ruleId}: ${m.message}`);
			});
			console.log('   → simple-import-sort 관련 오류 없음');
		}

		console.log('\n' + '='.repeat(50));
		if (importSortErrors.length === 0) {
			console.log('❌ 실패 사례: simple-import-sort 규칙이 적용되지 않아');
			console.log('   잘못된 import 순서를 감지하지 못했습니다.');
			console.log('\n   → @broccoil/lint를 사용하면 이 문제가 해결됩니다.');
			process.exit(1);
		}
	} catch (error) {
		console.error('❌ 테스트 실행 오류:', error.message);
		process.exit(1);
	} finally {
		await unlink(tempConfigPath).catch(() => {});
	}
}

testImportSortFailure().catch((error) => {
	console.error('테스트 실행 중 오류:', error);
	process.exit(1);
});
