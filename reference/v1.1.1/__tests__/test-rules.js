import { ESLint } from 'eslint';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import { readdir, writeFile, unlink, readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures', 'rules');

/**
 * 규칙별 fixture 테스트
 *
 * 각 fixture 파일의 첫 줄 주석으로 기대 동작을 선언합니다.
 *   // @expect-rule: <rule-id>   → 해당 규칙이 1회 이상 리포트되어야 함
 *   // @expect-pass: <rule-id>   → 해당 규칙이 리포트되지 않아야 함
 *
 * preset으로는 react.js를 사용합니다 (대부분의 규칙이 여기에 포함됨).
 */
async function testRules() {
	console.log('🧪 규칙별 fixture 테스트 시작...\n');

	const tempConfigPath = path.join(__dirname, 'temp-rules.config.js');
	const configPath = path.join(rootDir, 'react.js');
	const configCode = `import config from ${JSON.stringify(pathToFileURL(configPath).href)};\nexport default config;\n`;
	await writeFile(tempConfigPath, configCode, 'utf8');

	const eslint = new ESLint({ overrideConfigFile: tempConfigPath });

	const files = (await readdir(fixturesDir))
		.filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
		.map((f) => path.join(fixturesDir, f));

	let passed = 0;
	let failed = 0;

	try {
		for (const file of files) {
			const source = await readFile(file, 'utf8');
			const firstLine = source.split('\n')[0];
			const expectRule = /@expect-rule:\s*([\w-/@]+)/.exec(firstLine);
			const expectPass = /@expect-pass:\s*([\w-/@]+)/.exec(firstLine);
			const fileName = path.basename(file);

			const results = await eslint.lintFiles([file]);
			const messages = results[0]?.messages ?? [];

			// 파서/설정 치명 오류(fatal, ruleId 없음)는 fixture 결과를 왜곡하므로 먼저 실패 처리
			const fatalErrors = messages.filter((m) => m.fatal || m.ruleId == null);
			if (fatalErrors.length > 0) {
				console.log(`  ❌ ${fileName}: 파서/설정 치명 오류 발생`);
				fatalErrors.forEach((m) => {
					console.log(`     - ${m.line}:${m.column} ${m.message}`);
				});
				failed++;
				continue;
			}

			const ruleIds = new Set(messages.map((m) => m.ruleId).filter(Boolean));

			if (expectRule) {
				const rule = expectRule[1];
				if (ruleIds.has(rule)) {
					console.log(`  ✅ ${fileName}: ${rule} 감지됨`);
					passed++;
				} else {
					console.log(`  ❌ ${fileName}: ${rule} 감지 안 됨`);
					console.log(`     실제 감지된 규칙: ${[...ruleIds].join(', ') || '(없음)'}`);
					failed++;
				}
			} else if (expectPass) {
				const rule = expectPass[1];
				if (!ruleIds.has(rule)) {
					console.log(`  ✅ ${fileName}: ${rule} 정상 통과`);
					passed++;
				} else {
					console.log(`  ❌ ${fileName}: ${rule} 이 잘못 감지됨`);
					const offending = messages.filter((m) => m.ruleId === rule);
					offending.forEach((m) => {
						console.log(`     - ${m.line}:${m.column} ${m.message}`);
					});
					failed++;
				}
			} else {
				console.log(`  ⚠️  ${fileName}: @expect-rule 또는 @expect-pass 주석 없음 (스킵)`);
			}
		}
	} finally {
		await unlink(tempConfigPath).catch(() => {});
	}

	console.log('\n==================================================');
	if (failed === 0) {
		console.log(`✅ 모든 규칙 fixture 테스트 통과 (${passed}/${passed + failed})`);
	} else {
		console.log(`❌ 규칙 fixture 테스트 실패: ${failed}건`);
		process.exit(1);
	}
}

testRules().catch((error) => {
	console.error('테스트 실행 중 오류 발생:', error);
	process.exit(1);
});
