import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

/**
 * 설정 파일들이 올바르게 로드되는지 테스트합니다.
 * 이 테스트는 실제 ESLint를 실행하지 않고 설정 파일의 구조만 확인합니다.
 */
async function testConfigLoad() {
	console.log('🧪 ESLint 설정 파일 로드 테스트 시작...\n');

	const configs = [
		{ name: '기본 설정 (index.js)', file: 'index.js' },
		{ name: 'React 설정 (react.js)', file: 'react.js' },
		{ name: 'Next.js 설정 (next.js)', file: 'next.js' },
		{ name: 'Preset base', file: 'presets/base.js' },
		{ name: 'Preset react', file: 'presets/react.js' },
		{ name: 'Preset next', file: 'presets/next.js' },
		{ name: 'Preset full', file: 'presets/full.js' },
		{ name: 'TypeScript 규칙', file: 'rules/typescript/ts.js' },
		{ name: 'Import 규칙', file: 'rules/base/imports.js' },
		{ name: 'A11y 규칙', file: 'rules/accessibility/a11y.js' },
		{ name: 'Prettier 규칙', file: 'rules/formatting/prettier.js' },
		{ name: 'React 규칙', file: 'rules/react/react.js' },
	];

	let allPassed = true;

	for (const config of configs) {
		try {
			const configPath = path.join(rootDir, config.file);
			const configModule = await import(`file://${configPath}`);

			// 설정이 export되어 있는지 확인
			if (!configModule.default) {
				console.error(`  ❌ ${config.name}: default export가 없습니다`);
				allPassed = false;
				continue;
			}

			const configValue = configModule.default;

			// 배열인지 확인 (flat config 형식)
			if (Array.isArray(configValue)) {
				console.log(`  ✅ ${config.name}: 배열 형식으로 올바르게 로드됨 (${configValue.length}개 항목)`);
			} else if (typeof configValue === 'object' && configValue !== null) {
				console.log(`  ✅ ${config.name}: 객체 형식으로 올바르게 로드됨`);
			} else {
				console.error(`  ❌ ${config.name}: 예상치 못한 형식입니다 (${typeof configValue})`);
				allPassed = false;
			}
		} catch (error) {
			console.error(`  ❌ ${config.name}: 로드 실패 - ${error.message}`);
			allPassed = false;
		}
	}

	console.log('\n' + '='.repeat(50));
	if (allPassed) {
		console.log('✅ 모든 설정 파일이 올바르게 로드되었습니다!');
	} else {
		console.log('❌ 일부 설정 파일 로드에 실패했습니다.');
		process.exit(1);
	}
}

// 테스트 실행
testConfigLoad().catch((error) => {
	console.error('테스트 실행 중 오류 발생:', error);
	process.exit(1);
});

