import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const temporary = await mkdtemp(path.join(tmpdir(), 'broccoil-lint-'));
const npm = (args, cwd = process.cwd()) => execFileSync('npm', args, {
  cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'],
});

try {
  const [packed] = JSON.parse(npm(['pack', '--json', '--pack-destination', temporary]));
  assert(!packed.files.some(({ path: file }) => /^(reference|__tests__|docs|\.github)\//.test(file)),
    'The package must exclude reference sources and development files');
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const tarball = path.join(temporary, packed.filename);

  for (const preset of ['react', 'next']) {
    const cwd = path.join(temporary, preset);
    await mkdir(path.join(cwd, 'pages'), { recursive: true });
    await writeFile(path.join(cwd, 'pages/index.js'), 'export default function Page() {}\n');
    const dependencies = {
      [pkg.name]: `file:${tarball}`,
      eslint: pkg.peerDependencies.eslint,
      typescript: pkg.peerDependencies.typescript,
    };
    if (preset === 'next') {
      dependencies['@next/eslint-plugin-next'] = pkg.peerDependencies['@next/eslint-plugin-next'];
    }
    await writeFile(path.join(cwd, 'package.json'), JSON.stringify({
      private: true, type: 'module', dependencies,
    }, null, 2));
    npm(['install', '--ignore-scripts', '--engine-strict', '--no-audit', '--no-fund'], cwd);
    if (preset === 'react') {
      await assert.rejects(access(path.join(cwd, 'node_modules/@next/eslint-plugin-next')), { code: 'ENOENT' });
    }
    await writeFile(path.join(cwd, 'verify.js'), `
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import config from '${pkg.name}/${preset}';

const entries = ['', '/react', '/ts', '/a11y', '/import', '/prettier', '/presets/base', '/presets/react'];
if (${preset === 'next'}) entries.push('/next', '/presets/next', '/presets/full');
for (const entry of entries) {
  const loaded = await import('${pkg.name}' + entry);
  assert(loaded.default && typeof loaded.default === 'object', entry + ' must load from the tarball');
}
const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });
for (const extension of ['jsx', 'tsx']) {
  const [good] = await eslint.lintText(
    'export function Heading() {\\n  return <h1>Hello</h1>;\\n}\\n',
    { filePath: 'src/Heading.' + extension },
  );
  assert.deepEqual(good.messages, [], 'Valid ' + extension + ' must have no diagnostics');
}
const [bad] = await eslint.lintText('export const equal = (left, right) => left == right;\\n', {
  filePath: 'src/equal.js',
});
assert(bad.messages.some(({ ruleId }) => ruleId === 'eqeqeq'), 'Invalid equality must be diagnosed');

const source = 'import { zeta } from "zeta";\\nimport { alpha } from "alpha";\\n\\nexport const values = [zeta, alpha];\\n';
const expected = 'import { alpha } from "alpha";\\nimport { zeta } from "zeta";\\n\\nexport const values = [zeta, alpha];\\n';
const fix = new ESLint({ overrideConfigFile: true, overrideConfig: config, fix: true });
const [sorted] = await fix.lintText(source, { filePath: 'src/order.ts' });
assert.equal(sorted.output, expected, 'Imports must be sorted without changing the code');
assert.deepEqual(sorted.messages, []);
const [stable] = await fix.lintText(expected, { filePath: 'src/order.ts' });
assert.equal(stable.output, undefined, 'A second fix must make no changes');
assert.deepEqual(stable.messages, []);

const [unused] = await fix.lintText(
  'import { unused } from "unused";\\nexport const value = 1;\\n', { filePath: 'src/unused.ts' },
);
assert.equal(unused.output, 'export const value = 1;\\n', 'Unused imports must be removed');
assert.deepEqual(unused.messages, []);

if (${pkg.version.startsWith('2.')} ) {
  const [types] = await eslint.lintText(
    'export type Props = React.ComponentProps<"div">;\\n', { filePath: 'src/types.ts' },
  );
  assert(!types.messages.some(({ ruleId, fatal }) => fatal || ruleId === 'no-undef'));
}
if (${preset === 'next'}) {
  const [page] = await eslint.lintText(
    'export default function Page() { return <script src="https://example.com/script.js" />; }',
    { filePath: 'pages/index.tsx' },
  );
  assert(page.messages.some(({ ruleId }) => ruleId === '@next/next/no-sync-scripts'));
}
`);
    execFileSync(process.execPath, ['verify.js'], { cwd, stdio: 'inherit' });
    console.log(`Packed ${pkg.name}@${pkg.version}: ${preset} installation, diagnostics and fixes passed`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
