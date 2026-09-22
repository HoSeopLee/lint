import { ESLint } from 'eslint';
import { fileURLToPath } from 'url';
import path from 'path';
import { writeFile, unlink, readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');
const importOrderFile = path.join(fixturesDir, 'import-order-only.tsx');

/**
 * simple-import-sort 규칙이 적용되는지 검증합니다.
 */
async function testImportSort() {
	console.log('🧪 Import 규칙(simple-import-sort) 적용 테스트\n');

	const tempConfigPath = path.join(__dirname, 'temp-eslint.config.js');
	const configPath = path.join(rootDir, 'next.js');

	try {
		const configModule = await import(`file://${configPath}`);
		const config = configModule.default;

		const configCode = `import config from '${configPath.replace(/\\/g, '/')}';
export default config;`;
		await writeFile(tempConfigPath, configCode, 'utf8');

		const eslint = new ESLint({
			overrideConfigFile: tempConfigPath,
		});

		// 1. 잘못된 import 순서에 simple-import-sort 오류가 발생하는지 확인
		console.log('1️⃣  잘못된 import 순서에 simple-import-sort 오류 발생 확인...');
		const results = await eslint.lintFiles([importOrderFile]);
		const messages = results[0]?.messages ?? [];
		const importSortErrors = messages.filter(
			(m) => m.ruleId === 'simple-import-sort/imports' || m.ruleId === 'simple-import-sort/exports'
		);

		if (importSortErrors.length === 0) {
			console.error('   ❌ simple-import-sort 규칙이 적용되지 않았습니다.');
			console.error('   import-order-only.tsx에는 잘못된 import 순서가 있으므로 오류가 발생해야 합니다.');
			process.exit(1);
		}
		console.log(`   ✅ simple-import-sort 오류 ${importSortErrors.length}개 감지됨`);

		// 2. --fix 적용 시 import가 정렬되는지 확인
		console.log('\n2️⃣  --fix 적용 시 import 자동 정렬 확인...');
		const fixEslint = new ESLint({
			overrideConfigFile: tempConfigPath,
			fix: true,
		});
		const fixResults = await fixEslint.lintFiles([importOrderFile]);
		const fixedOutput = fixResults[0]?.output;

		if (!fixedOutput) {
			console.error('   ❌ --fix 적용 후 출력이 없습니다.');
			process.exit(1);
		}

		const originalContent = await readFile(importOrderFile, 'utf8');
		if (originalContent === fixedOutput) {
			console.error('   ❌ --fix 적용 후에도 파일 내용이 변경되지 않았습니다.');
			process.exit(1);
		}

		console.log('   ✅ --fix로 import 순서가 정렬됨');

		console.log('\n' + '='.repeat(50));
		console.log('✅ Import 규칙(simple-import-sort) 정상 적용됨!');
	} catch (error) {
		console.error('❌ 테스트 실패:', error.message);
		process.exit(1);
	} finally {
		await unlink(tempConfigPath).catch(() => {});
	}
}

testImportSort().catch((error) => {
	console.error('테스트 실행 중 오류:', error);
	process.exit(1);
});
