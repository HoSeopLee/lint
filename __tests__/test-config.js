import { ESLint } from 'eslint';
import { fileURLToPath } from 'url';
import path from 'path';
import { readdir, writeFile, unlink } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

/**
 * ESLint 설정이 올바르게 로드되고 작동하는지 테스트합니다.
 */
async function testConfig() {
	console.log('🧪 ESLint 설정 테스트 시작...\n');

	// React 설정 테스트
	await testConfigFile('react.js', 'React 설정');

	// Next.js 설정 테스트
	await testConfigFile('next.js', 'Next.js 설정');

	// 공개 /ts export가 단독으로 parser와 plugin을 제공하는지 테스트
	await testStandaloneTsConfig();
}

async function testStandaloneTsConfig() {
	console.log('📋 TypeScript 단독 설정 테스트 중...');
	const { default: config } = await import(`file://${path.join(rootDir, 'rules/typescript/ts.js')}`);
	const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [config] });
	const [result] = await eslint.lintText('const value: any = 1;', { filePath: 'standalone.ts' });
	const fatalMessages = result.messages.filter((message) => message.fatal || message.ruleId == null);

	if (fatalMessages.length > 0) {
		throw new Error(fatalMessages.map((message) => message.message).join('; '));
	}
	if (!result.messages.some((message) => message.ruleId === '@typescript-eslint/no-explicit-any')) {
		throw new Error('TypeScript 단독 설정에서 @typescript-eslint 규칙이 실행되지 않았습니다.');
	}

	console.log('  ✅ TypeScript parser/plugin 및 규칙 정상\n');
}

/**
 * 특정 설정 파일을 테스트합니다.
 */
async function testConfigFile(configFile, configName) {
	console.log(`📋 ${configName} 테스트 중...`);

	// 임시 설정 파일 생성
	const tempConfigPath = path.join(__dirname, 'temp-eslint.config.js');
	
	try {
		// 설정 파일 import
		const configPath = path.join(rootDir, configFile);
		const configModule = await import(`file://${configPath}`);
		const config = configModule.default;

		// 임시 설정 파일 생성 (ESLint 9는 설정 파일 경로를 필요로 함)
		const configCode = `import config from '${configPath.replace(/\\/g, '/')}';
export default config;`;
		await writeFile(tempConfigPath, configCode, 'utf8');

		// ESLint 인스턴스 생성 (ESLint 9 flat config)
		const eslint = new ESLint({
			overrideConfigFile: tempConfigPath,
		});

		// fixtures 디렉토리의 모든 파일 가져오기
		const files = await readdir(fixturesDir);
		const testFiles = files
			.filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
			.map((file) => path.join(fixturesDir, file));

		if (testFiles.length === 0) {
			console.log(`  ⚠️  테스트 파일이 없습니다.\n`);
			await unlink(tempConfigPath).catch(() => {});
			return;
		}

		// 각 파일에서 parser/config fatal 오류 없이 ESLint가 실행되는지 확인
		for (const file of testFiles) {
			const results = await eslint.lintFiles([file]);
			const fileName = path.basename(file);
			const messages = results[0]?.messages ?? [];
			const fatalMessages = messages.filter((message) => message.fatal || message.ruleId == null);

			if (fatalMessages.length > 0) {
				throw new Error(
					`${fileName}: ${fatalMessages.map((message) => message.message).join('; ')}`,
				);
			}

			console.log(`  ✅ ${fileName}: 설정 정상 (규칙 메시지 ${messages.length}개)`);
		}

		console.log(`  ✅ ${configName} 테스트 완료\n`);
	} catch (error) {
		console.error(`  ❌ ${configName} 테스트 실패:`, error.message);
		if (error.stack) {
			console.error(error.stack);
		}
		process.exit(1);
	} finally {
		// 임시 파일 정리
		await unlink(tempConfigPath).catch(() => {});
	}
}

// 테스트 실행
testConfig().catch((error) => {
	console.error('테스트 실행 중 오류 발생:', error);
	process.exit(1);
});
