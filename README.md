# @broccoil/lint

React와 Next.js 프로젝트에서 사용하는 개인 ESLint Flat Config입니다. 하나의 npm 패키지를 두 major 버전으로 유지합니다.

> 첫 배포 준비 중입니다. 분리·검증 결과를 사용자가 확인하고 명시적으로 승인한 뒤 npm에 배포합니다. 아래 설치 명령은 배포 후 사용할 명령입니다.

| 계열 | 유지 브랜치 | 첫 배포 버전 | 설정 기준 | npm 태그 |
| --- | --- | --- | --- | --- |
| Legacy | `1.x` | `1.0.0` | 참고 1.1.1 | `legacy` |
| Modern | `main` | `2.0.0` | 참고 2.0.1 | `latest` |

브랜치별 package.json, lockfile, 의존성, 테스트와 CHANGELOG를 독립적으로 관리합니다. 패키지명과 import 경로는 같습니다. workspace나 별도 `lint-legacy` 패키지는 사용하지 않습니다.

## 설치

프로젝트 환경에 맞는 한 가지 명령을 실행합니다.

```sh
# ESLint 9 / TypeScript 5 프로젝트
npm install -D @broccoil/lint@1 eslint@9 typescript@5

# ESLint 10 / TypeScript 6.0 프로젝트
npm install -D @broccoil/lint@2 eslint@10 typescript@~6.0.2
```

필수 plugin은 npm의 peer 의존성 설치로 제공됩니다. 정확한 범위는 설치할 버전의 package.json을 확인하세요. React preset에는 Next plugin이 필요하지 않습니다.

Next preset을 사용할 때는 별도로 설치합니다.

```sh
# 1.x: Next 15 또는 16 중 프로젝트에 맞는 버전
npm install -D @next/eslint-plugin-next@15

# 2.x: Next 16
npm install -D @next/eslint-plugin-next@16
```

Node 지원 선언은 1.x에서 `>=20.19.0`, 2.x에서 `^22.13.0 || >=24.0.0`입니다. 설치 시 각 plugin의 engine 제약도 적용됩니다. 실제 확인한 조합은 [배포 검증 기록](docs/release-checklist.md)에 기록합니다.

## 사용

```js
// eslint.config.js (ESM 프로젝트)
import config from '@broccoil/lint/react';

export default config;
```

Next 프로젝트에서는 import 경로를 `@broccoil/lint/next`로 바꿉니다. package.json에 `"type": "module"`이 없다면 설정 파일 이름은 `eslint.config.mjs`로 사용합니다.

프로젝트 규칙은 preset 뒤에서 덮어씁니다.

```js
import config from '@broccoil/lint/react';

export default [
  ...config,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: { 'no-console': 'warn' },
  },
];
```

```sh
npx eslint src
npx eslint src --fix
npx prettier . --write
npx tsc --noEmit
```

Prettier는 기존 정책대로 ESLint에도 연결되어 있습니다. TypeScript 타입 검사는 프로젝트의 tsconfig로 별도 실행하세요. 2.x의 TS 파일에서는 core `no-undef`를 끄고 타입 검사에 맡깁니다. 추가 type-aware lint는 이번 배포에 포함하지 않습니다.

기존 공개 경로도 유지합니다: 기본 import(React), `/react`, `/next`, `/ts`, `/a11y`, `/import`, `/prettier`, `/presets/base`, `/presets/react`, `/presets/next`, `/presets/full`(Next alias). 기본 프리셋은 JS/JSX/TS/TSX용이며, base의 globals는 브라우저 기준입니다. `.mjs/.cjs/.mts/.cts`에 같은 규칙이 적용된다고 가정하지 않습니다.

## 1.x에서 2.x로 변경할 때

import 경로는 같지만 지원 환경과 일부 규칙이 다릅니다. 아래 항목을 확인하고 major를 선택하세요.

| 항목 | 1.x | 2.x |
| --- | --- | --- |
| ESLint | 9.x | 10.0.1 이상 11 미만 |
| TypeScript | 4.8.4 이상 6 미만 | 6.0.2 이상 6.1 미만 |
| 접근성 규칙 ID | `jsx-a11y/*` | `jsx-a11y-x/*` |
| React plugin | @eslint-react 2.x | @eslint-react 5.x; 일부 rule ID 변경 |
| 상위 상대 import | 기존 plugin의 alias 변환/fix 정책 | core `no-restricted-imports` 경고, alias 자동 변환 없음 |
| TS의 core no-undef | 기존 설정 유지 | off; 별도 타입 검사 필요 |

접근성·React rule override와 inline disable을 사용한다면 설치할 버전에 맞게 바꾸세요. 로컬 링크 규칙 ID `hoseop-react/no-unsafe-target-blank`는 호환성을 위해 두 계열 모두 유지합니다. 자세한 차이는 [호환성 분석](docs/compatibility.md), 각 릴리스 변경은 [CHANGELOG](CHANGELOG.md)에 기록합니다.

## 개발 및 배포

```sh
nvm use
npm ci --engine-strict
npm test
npm run test:package
```

`test:package`는 실제 tarball을 임시 React·Next 프로젝트에 설치하고 공개 entry point, 진단과 자동 수정을 검증합니다. 테스트가 끝나면 임시 프로젝트를 제거합니다.

- [작업 환경과 브랜치 운영](docs/development.md)
- [1차 목표와 후속 작업](docs/roadmap.md)
- [참고 버전의 호환성 분석](docs/compatibility.md)
- [배포 검증 및 승인](docs/release-checklist.md)

`reference/`는 비교 자료이며 npm에 포함하지 않습니다. [MIT](LICENSE).
