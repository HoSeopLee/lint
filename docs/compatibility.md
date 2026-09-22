# 버전 비교와 호환성 분석

참고 코드 분석일: 2026-09-17. 배포 구조는 2026-09-22 합의에 맞춰 갱신했습니다. 현재 비교 기준은 `v1.1.1`, `v2.0.1`입니다. 참고 자료의 명칭 정리 범위는 [참고 자료 안내](../reference/README.md)에 기록했습니다. 이 버전 번호는 새 패키지의 릴리스 번호가 아닙니다.

**여기에 적힌 버전 범위는 원본 package.json의 선언입니다. 설치 성공이나 전체 조합의 동작 보장을 의미하지 않습니다.** 아래 표는 참고 코드의 정적 분석입니다. 새 배포 코드의 실행 결과는 [배포 검증 기록](release-checklist.md)을 따릅니다.

## 주요 결론

1. legacy 기준은 1.1.1로 한정합니다. 첫 배포 목표에 1.1.1 기반 legacy(1.0.0)와 2.0.1 기반 modern(2.0.0)을 모두 포함합니다.
2. 1.1.1은 ESLint 9를 요구합니다. ESLint 8 지원은 별도 검증이 필요한 후속 목표입니다.
3. 2.0.1은 ESLint `>=10.0.1 <11.0.0`, TypeScript `>=6.0.2 <6.1.0`을 선언합니다. TypeScript 6 전체로 범위를 넓혀 해석하지 않습니다.
4. 양쪽 모두 ESM / Flat Config입니다. legacy라는 이름이 `.eslintrc` 지원을 뜻하지는 않습니다.
5. 1.1.1과 2.0.1에는 type-aware lint를 활성화하는 `project` / `projectService`가 없습니다. Promise 검사 등은 새 요구사항입니다.
6. subpath export는 코드 진입점을 나눌 뿐, peerDependencies와 engines를 진입점별로 분리하지 않습니다. 현재 진행 방향은 하나의 npm 패키지를 브랜치별 major 버전으로 배포하는 것입니다.

## dependencies / peerDependencies

두 기준 버전 모두 일반 `dependencies`가 없고 plugin을 peerDependencies로 요구합니다. Next plugin만 optional peer입니다. optional 선언은 Next를 import하지 않는 사용자를 위한 것이며, Next preset을 사용하려면 plugin을 설치해야 합니다.

| 항목 | 1.1.1 | 2.0.1 |
| --- | --- | --- |
| Node engines | `>=20.19.0` | `>=22.13.0` |
| `@eslint-react/eslint-plugin` | `^2.13.0` | `>=5.16.1 <6.0.0` |
| `@eslint/js` | `>=9.0.0 <10.0.0` | `>=10.0.1 <11.0.0` |
| `@next/eslint-plugin-next` | `>=15.0.0 <17.0.0` | `>=16.0.0 <17.0.0` |
| `eslint` | `>=9.0.0 <10.0.0` | `>=10.0.1 <11.0.0` |
| `eslint-config-prettier` | `>=9.0.0 <11.0.0` | `>=10.1.0 <11.0.0` |
| `eslint-plugin-import-x` | `>=4.0.0 <5.0.0` | `>=4.17.1 <5.0.0` |
| `eslint-plugin-jsx-a11y` | `>=6.10.0 <7.0.0` | `—` |
| `eslint-plugin-jsx-a11y-x` | `—` | `>=0.2.0 <1.0.0` |
| `eslint-plugin-no-relative-import-paths` | `>=1.6.0 <2.0.0` | `—` |
| `eslint-plugin-prettier` | `>=5.1.0 <6.0.0` | `>=5.5.6 <6.0.0` |
| `eslint-plugin-react-hooks` | `>=5.0.0 <8.0.0` | `>=7.1.1 <8.0.0` |
| `eslint-plugin-react-refresh` | `>=0.4.0 <0.6.0` | `>=0.5.3 <0.6.0` |
| `eslint-plugin-simple-import-sort` | `>=12.0.0 <14.0.0` | `>=13.0.0 <14.0.0` |
| `eslint-plugin-unused-imports` | `>=4.0.0 <5.0.0` | `>=4.4.1 <5.0.0` |
| `globals` | `>=15.0.0 <18.0.0` | `>=17.7.0 <18.0.0` |
| `prettier` | `>=3.0.0 <4.0.0` | `>=3.9.5 <4.0.0` |
| `typescript` | `>=4.8.4 <6.0.0` | `>=6.0.2 <6.1.0` |
| `typescript-eslint` | `>=8.0.0 <9.0.0` | `>=8.64.0 <9.0.0` |

1.1.1 CI에는 Node 20.19 최소 / 20·22·24 최신 의존성 조합이, 2.0.1 CI에는 Node 22.13 최소 / 22·24·25 최신 조합이 정의되어 있습니다. 이번 작업에서 해당 CI 결과를 재실행하거나 통과 여부를 확인하지는 않았습니다.

## 디렉터리와 preset 구성

두 비교 기준 모두 `presets/` + `rules/` 구조입니다. 각 공개 진입점은 package.json의 exports로 노출됩니다.

| 항목 | 현재 동작 | 분류 / 새 패키지 방향 |
| --- | --- | --- |
| 루트 `index.js` | React preset 재노출 | MODERNIZE: 개인 패키지의 루트가 React를 뜻할지는 별도 결정 |
| `/react`, `/presets/react` | JS/JSX/TS/TSX + React/Hooks/Refresh + import + a11y + Prettier | LEGACY / MODERN: 진단과 fix 결과를 비교하며 각각 보존 |
| `/next`, `/presets/next` | React 계열 규칙 + Next + browser/Node globals | LEGACY / MODERN: Next plugin을 사용하는 진입점으로 한정 |
| `/presets/base` | JS + import + Prettier, browser globals | MODERNIZE: Node 용도라는 주석과 실제 globals가 다름. 환경 선택을 명확히 할 것 |
| `/presets/full` | Next preset의 단순 alias | REMOVE 후보: 새 패키지에 의미가 불명확한 full은 만들지 않음 |
| `/ts` | 두 기준 모두 parser/plugin 자체 포함 | LEGACY / MODERNIZE: 단독 사용과 preset 내부 조합을 구분 |
| `/a11y`, `/import`, `/prettier` | 규칙 객체를 개별 노출 | SHARED 정책, 공개 여부는 실제 소비자의 사용 조사 후 결정 |
| ignores | 빌드·coverage·config 파일 등 제외, Next는 `.next`, `out` 추가 | SHARED + MODERNIZE: monorepo 경로·config 파일 제외 의도를 검증 |
| `files` | TS/TSX와 JS/JSX 분리. base는 `**/*.js` | MODERNIZE: `.mjs` / `.cjs` / `.mts` / `.cts` 지원을 별도로 검증 |
| Vue / Nuxt / Oxlint | 구현 없음 | MODERN / OXLINT: 후속 작업 |

preset의 규칙 병합 순서는 TypeScript → import → React → a11y → Prettier → Next(해당 시) → general입니다. 2.0.1의 TS 블록에는 마지막 `no-undef: off`가 추가됩니다. 개별 rules 파일과 최종 적용 값이 같다고 가정하지 않습니다.

## 규칙 분류

`SHARED`는 공통 정책, `LEGACY`는 호환성 보존, `MODERN`은 최신 환경 설정, `OXLINT`는 modern에서 이관할 후보, `MODERNIZE`는 구현 변경, `REMOVE`는 불필요·중복 설정 제거 후보입니다. 정책과 실행 도구는 다른 축이므로 한 항목에 두 분류가 붙을 수 있습니다. 아래 REMOVE는 새 런타임 구현에서의 제거 후보입니다.

| 정책 / 설정 | 원본 비교 | 분류 | 처리 방향 |
| --- | --- | --- | --- |
| JS recommended | 양쪽 `@eslint/js` recommended, major 다름 | SHARED / OXLINT 후보 | 실제 확장 규칙은 설치 버전에 따라 다름. resolved config 비교 |
| `eqeqeq`, `no-eval`, `no-var`, `prefer-const` 등 | 1.1.1과 2.0.1의 generalRules 동일 | SHARED / OXLINT 후보 | severity와 옵션까지 보존 |
| `no-plusplus`, `prefer-destructuring` | 루프 증감 허용, 변수 객체 구조분해 강제 | SHARED | 개인 기본 정책 채택 여부 결정 |
| console·중첩 삼항·debugger·alert | off / warn 혼합 | SHARED | 무조건 strict로 올리지 않음 |
| `eslint-disable-next-line: off` | 규칙 ID가 아닌 주석 지시문 이름을 설정에 포함 | REMOVE | 새 구현에서 제거. 주석 제어 정책과 구분 |
| `global-require: off` 등 과거 off 항목 | 양쪽에 남음 | REMOVE 후보 | 활성 preset과 소비자 override 영향 확인 후 제거 |
| TS recommended | 양쪽 `typescript-eslint.configs.recommended` | SHARED | typed recommended가 아님 |
| TS parser 및 plugin | 1.1.1부터 `/ts`에 자체 제공 | MODERNIZE | 단독 TS export 동작 보존 |
| typed lint 실행 설정 | 두 기준 모두 `project` / `projectService` 미지정 | MODERN | 추가 typed lint는 후속 선택 기능으로 검토 |
| naming-convention | 변수·함수·typeLike·I/T 접두사 정책 동일 | SHARED | 옵션 보존, 실행 시 type 정보 요구 여부 검증 |
| TS any·empty-function·prefer-as-const | warn / warn / error 동일 | SHARED / OXLINT 후보 | 진단과 옵션 대조 |
| TS no-unused-vars | off, unused-imports로 위임 | SHARED | 중복 진단 방지 |
| TS lines-between-class-members / no-throw-literal | off 항목 잔존 | REMOVE 후보 | 선정한 plugin의 삭제·대체 규칙 확인 후 정리 |
| Promise 오용 검사 | 명시적 typed 규칙 없음 | MODERN | 필요 규칙과 type-aware 실행 비용을 별도 결정 |
| React key·children·state·Fragment·DOM 정책 | 1.1.1 `@eslint-react` 2.x, 2.0.1 5.x | LEGACY / MODERNIZE | rule ID 치환만으로 동작 동일성을 가정하지 않음 |
| JSX boolean·Fragment 축약 | 1.1.1의 명시 규칙이 2.0.1에서 빠짐 | LEGACY / MODERNIZE | 필요한 스타일 정책과 Prettier 적용 범위 대조 |
| JSX 중복 props | 1.1.1 explicit 규칙, 2.0.1에서 제거 | MODERNIZE | JS 파서 및 TS 진단 범위 비교, 검사 공백 확인 |
| JSX 미정의 식별자 | 1.1.1 전용 규칙 → 2.0.1 core no-undef, TS에서는 off | MODERNIZE | JS/JSX는 ESLint, TS는 타입 검사와 함께 검증 |
| React deprecated API | 1.1.1 plugin preset에서 동적 추출 → 2.0.1 명시 목록 | MODERNIZE | React 버전별 필요 정책 확인 |
| 외부 링크 `_blank` | 로컬 `broccoil-react/no-unsafe-target-blank` (개인 namespace로 정리) | LEGACY / MODERNIZE | 동적 href·spread·rel 표현식도 fixture로 비교. 완전 동등 보장 없음 |
| `react-hooks/rules-of-hooks` | 두 버전 error | SHARED / OXLINT 후보 | React Compiler 추가 규칙과 분리 |
| `react-hooks/exhaustive-deps` | 두 기준 버전 모두 off | SHARED | 활성화는 새로운 정책 변경으로 취급 |
| React Refresh | TS/TSX 기본 off, JS/JSX warn + allowConstantExport, 테스트 off | LEGACY / MODERNIZE | Vite/Next 적용 차이 검증 |
| import 정렬 | simple-import-sort, side effect→node→React/Next→외부→alias→상대→CSS | SHARED | 정렬 그룹과 fix 결과를 유지 |
| 중복·자기 import | import-x error | SHARED / OXLINT 후보 | resolver와 alias 차이 검증 |
| 미사용 import/변수 | unused-imports error, `_` 제외 옵션 | SHARED / OXLINT 후보 | 자동 삭제와 변수 옵션이 일치할 때만 이관 |
| 상대 경로 제한 | 전용 plugin + src/@ 설정 → core `no-restricted-imports`의 `../**` | LEGACY / MODERNIZE | alias 강제·진단 범위·자동 수정 차이 명시 |
| import-x off 규칙들 | unresolved, extraneous, extensions, default export, cycle, order | SHARED / REMOVE 후보 | 다른 preset에서 켜질 가능성이 없을 때만 불필요 off 제거 |
| 접근성 13개 규칙 | jsx-a11y → jsx-a11y-x, 옵션과 severity 유지 | SHARED / MODERNIZE / OXLINT 후보 | alt·ARIA·label·키보드 fixture로 대조 |
| Next 규칙 | 두 기준 버전의 Next rules 파일 동일 | SHARED | plugin은 15/16 vs 16 범위, pages/app router 검증 |
| formatting | Prettier plugin error + config-prettier off 규칙 병합 | SHARED / MODERNIZE | legacy 보존, modern에서 별도 format 명령 여부 검토 |
| 동적 recommended / Prettier 규칙 묶음 | 실제 plugin 버전에 따라 확장됨 | SHARED / MODERNIZE | lockfile 고정 후 최종 규칙 목록을 추출 |

### 2.1.0 작업 내용은 별도

기존 로컬 HEAD는 package.json이 2.1.0인 준비 커밋이며, 원격 태그 목록에는 2.1.0이 없습니다. npm 배포 여부는 확인하지 않았습니다. base의 Node globals 전환, `eqeqeq` null 예외, `exhaustive-deps: error`, Next async client component 검사가 2.0.1 이후 추가되어 있습니다. 이번 기준 스냅샷에는 포함하지 않았으며 새 정책 후보로만 검토합니다.

## 기존 프로젝트 이전 전략

1. 소비 프로젝트별 사용 패키지 버전, Node/ESLint/TS/React/Next 버전, lockfile, config 형식, deep import와 override 목록을 수집합니다.
2. 기존 설정으로 진단(rule ID·위치·severity)과 `--fix` 결과를 기록합니다. 1.1.1 사용 프로젝트를 legacy 비교 대상으로 삼습니다.
3. 같은 의존성 환경에서 새 legacy preset을 적용합니다. 먼저 package/import 경로만 바꾸고 런타임 업그레이드는 분리합니다.
4. 차이는 의도된 변경과 회귀로 나눕니다. plugin namespace 변경 때문에 소비자가 적은 rule override와 inline disable도 함께 이전합니다.
5. ESLint 8은 정확한 minor와 Flat Config / eslintrc 사용 여부부터 확인합니다. 범위가 맞는 parser/plugin으로 설치·로드·fixture 테스트를 통과하기 전 지원을 선언하지 않습니다.
6. 2.x 사용자는 ESLint 10 / TS 6.0.x 조합부터 유지합니다. Oxlint 추가와 엄격한 정책 적용을 한 번에 섞지 않습니다.

ESLint 9라고 TS 5만 쓰거나 ESLint 10이라고 TS 6만 쓰는 것은 아닙니다. 초기 기준은 위 조합이지만, 실제 필요한 교차 조합은 소비 프로젝트 조사 후 매트릭스에 추가합니다.

## 브랜치별 버전과 의존성 관리

현재 방식은 **한 저장소 + 한 npm 패키지 + 두 유지 브랜치**입니다.

| 브랜치 | npm 버전 | 참고 기준 | npm 태그 |
| --- | --- | --- | --- |
| 1.x | @broccoil/lint@1.0.0 | 1.1.1, legacy | legacy |
| main | @broccoil/lint@2.0.0 | 2.0.1, modern | latest |

각 브랜치의 루트 package.json에서 peerDependencies·engines·exports·버전을 관리합니다. 서로 다른 ESLint major의 의존성과 lockfile이 브랜치로 분리됩니다. 브랜치를 바꾼 뒤에는 npm ci를 다시 실행합니다.

각 버전의 tarball을 별도 소비 프로젝트에 설치하고 자신의 의존성만으로 entry point가 로드되는지 확인합니다. --force / --legacy-peer-deps는 호환성 성공으로 취급하지 않습니다. React 소비자에는 optional Next plugin이 없어야 하고 Next 소비자에는 해당 plugin을 명시적으로 설치합니다.

공개 경로는 참고 코드와 동일하게 유지합니다. 위 표의 REMOVE/MODERNIZE는 후속 후보이며 이번 배포에서 자동으로 적용하지 않습니다. 실제 npm 업로드는 검증 결과를 사용자에게 제시하고 승인받은 뒤 진행합니다. 구체적인 절차는 [개발 안내](development.md)를 따릅니다.

## Oxlint 역할

공식 [내장 plugin 목록](https://oxc.rs/docs/guide/usage/linter/plugins)에 JS/TS·React·Next·import·jsx-a11y 및 Vue script 관련 규칙이 있습니다. plugin 이름이 존재한다는 사실이 기존 규칙·옵션·자동 수정의 완전한 동등성을 보장하지는 않습니다. Vue template 전체 지원으로 해석하지 않습니다.

초기 이관 후보는 일반 오류 검사, 중복 import, React key, 접근성 등입니다. import 정렬의 사용자 그룹, 미사용 import fix, naming-convention, 로컬 링크 규칙, framework 전용 규칙은 동등성이 확인될 때까지 ESLint에 둡니다.

[공식 병행 실행 안내](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint#running-oxlint-and-eslint-together)에 따라 Oxlint와 ESLint를 별도 실행하고, Oxlint 설정에서 실제 켠 규칙과 일치하는 범위만 ESLint에서 끕니다. 중복 제거 설정이 검사를 누락시키지 않는지 확인합니다. legacy에는 Oxlint를 요구하지 않습니다.

Oxlint에도 [type-aware 모드](https://oxc.rs/docs/guide/usage/linter/type-aware)가 있으며 별도 `oxlint-tsgolint` 의존성을 사용합니다. 따라서 모든 type-aware 규칙을 ESLint 전용으로 단정하지 않습니다. 대상 프로젝트의 TS 의미·규칙 옵션·오탐을 비교해 담당 도구를 정합니다. 이번 단계에서 Oxlint 버전 선정·설치·성능 측정은 하지 않았습니다.

## 아직 검증하지 않은 사항

- 전체 버전 조합의 호환성(일부 확인한 조합은 배포 검증 기록 참조)
- 2.0.0 npm 실제 배포와 Git 태그 (1.0.0은 배포·설치·Git 태그 확인 완료)
- 실제 소비 프로젝트 목록과 필요한 Node/ESLint 8 최소 버전
- plugin별 peer/engine의 전이 제약, npm 외 패키지 매니저 호환성
- 규칙별 Oxlint 옵션·자동 수정 동등성, Vue/Nuxt parser와 template 범위

각 릴리스에 포함할 항목만 검증하고 README에 지원 기능으로 표시합니다. 후속 목표는 첫 배포를 막는 조건이 아닙니다.

## npm 원본 배포물 대조 — 2026-09-22

로컬 reference만을 기준으로 삼지 않고 `npm pack --ignore-scripts`로 받은 실제 원본과 각 유지 브랜치를 비교했습니다.

| 원본 npm 버전 | 비교 대상 | 결과 |
| --- | --- | --- |
| smartm2m-eslint-config@1.1.1 | 1.x의 @broccoil/lint@1.0.0 | 실행 파일 15개와 exports·peer 범위·optional peer 일치, 아래 명칭 차이 제외 |
| smartm2m-eslint-config@2.0.1 | main의 @broccoil/lint@2.0.0 | 실행 파일 15개와 exports·peer 범위·optional peer 일치, 아래 명칭 차이 제외 |

실행 파일의 차이는 진입점 주석과 React plugin namespace의 `smartm2m-react` → `broccoil-react` 변경뿐입니다. 이를 명시적으로 정규화한 문자열 비교를 통과했습니다. 따라서 같은 의존성 버전과 입력에서는 각 원본의 규칙·옵션·자동 수정 구현을 유지하지만, 사용자 override와 inline disable의 `smartm2m-react/no-unsafe-target-blank`는 새 ID로 변경해야 합니다.

위 비교는 현재 브랜치의 코드 기준입니다. 이미 게시된 `1.0.0`은 `hoseop-react` namespace를 사용하며, 1.x의 `broccoil-react` 전환은 아직 npm에 반영하지 않았습니다.

1.x의 Node engines는 원본과 같은 `>=20.19.0`입니다. main은 원본 `>=22.13.0`보다 좁은 `^22.13.0 || >=24.0.0`으로 Node 23을 제외합니다. 패키지명과 버전, 문서, 배포 파일 목록 및 개발·검증 환경도 원본과 다릅니다. 이는 두 major 사이의 동작이 동일하다는 뜻이 아니며, 1.x→2.x의 규칙·자동 수정 차이는 위 분석과 README를 따릅니다.
