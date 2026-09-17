# 구조 제안과 단계별 배포 계획

## 원칙

먼저 실제 사용할 수 있는 작은 패키지를 배포하고 확장합니다. 첫 배포 전에 legacy, modern, Oxlint, Vue/Nuxt 전체 설계를 완성하지 않습니다. 초기 버전 제안은 `0.1.0`이며, 참고 자료의 1.1.1 / 2.0.1과 새 패키지 버전은 별개입니다.

## 현재 상태

- [x] 새 저장소와 README 준비
- [x] 1.1.1 / 2.0.1 설정·테스트 참고 자료 정리
- [x] 개인 패키지 명칭과 로컬 plugin namespace로 통일
- [x] 호환성 분석과 배포 단계 작성
- [ ] 배포용 package.json과 공개 entry point 구현
- [ ] 실제 설치·lint·자동 수정 검증
- [ ] 첫 npm 배포

현재 저장소는 준비 자료입니다. 참고 폴더를 그대로 publish하지 않습니다. 최신 패키지 구조와 다른 컴퓨터에서의 시작 절차는 [작업 재개 안내](development.md)를 따릅니다.

## 첫 배포: modern React / Next

2.0.1을 바탕으로 현재 사용할 modern preset을 먼저 제공합니다. 이 단계에서 규칙을 대폭 강화하거나 lint 도구를 교체하지 않습니다.

할 일:

1. `@hoseop` scope 권한과 `@hoseop/lint` 이름을 확인합니다.
2. 루트에 private npm workspace를 만들고, 2.0.1의 React/Next 설정을 `packages/lint`로 옮깁니다.
3. 공개 경로를 `@hoseop/lint/react`, `@hoseop/lint/next`로 시작하는 안을 검증합니다. base/TypeScript는 내부 구성에 필요해도 독립 export는 필요할 때 추가합니다.
4. ESLint 10 / TS 6.0.x / Node 최소 버전과 실제 plugin peer/engine을 검증합니다.
5. Next plugin이 없는 React 소비자와 Next 소비자를 각각 확인합니다.
6. 설치 예제, override 방법, formatting 및 타입 검사 명령을 README에 작성합니다.
7. 아래 배포 기준을 통과하면 `0.1.0`을 배포합니다.

포함하지 않는 것: legacy 실행 지원, ESLint 8, Oxlint, Vue/Nuxt, 추가 typed lint, 전체 plugin 재설계. 기존 정책의 오류를 고치는 경우에만 별도 근거와 회귀 검사를 남깁니다.

## 첫 배포 완료 기준

- 일반 설치 명령으로 peer 충돌 없이 설치됩니다. `--force` / `--legacy-peer-deps`는 성공으로 간주하지 않습니다.
- 공개 React/Next entry point가 로드되고 정상·오류 fixture, import 자동 수정, TS namespace의 no-undef 예외가 확인됩니다.
- Node 최소 버전과 지원 범위 내 최신 버전에서 확인합니다.
- package.json에 name, version, license, repository, files, exports, engines, peerDependencies를 실제 결과에 맞게 작성합니다.
- `npm pack --dry-run`으로 배포 파일을 검사하고, 실제 tarball을 별도 소비 프로젝트에 설치해 실행합니다.
- reference와 내부 테스트 자료는 배포 파일에서 제외합니다.
- README에는 구현·검증된 지원만 표시하고 CHANGELOG에 첫 기능을 기록합니다.

공개 scoped package의 배포 절차는 [npm 공식 안내](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)를 따릅니다. 실제 배포 시 scope 권한과 인증 상태를 확인하고 public access를 지정합니다. 지금은 배포하지 않았습니다.

## 후속 1: legacy 지원

1.1.1을 기준으로 ESLint 9 / TS 5 환경을 유지합니다. 먼저 해당 소비 프로젝트의 lockfile·override·inline disable과 기존 진단/fix 결과를 수집합니다.

같은 저장소의 `packages/lint-legacy`에서 `@hoseop/lint-legacy`를 독립 패키지로 구현합니다. 각 package.json에 의존성·peerDependencies·engines·exports를 선언하고 별도로 배포합니다. workspace 설치가 성공하더라도 각 tarball을 격리된 소비 프로젝트에 설치해 확인합니다.

완료 기준: 기존 소비 프로젝트를 불필요하게 업그레이드하지 않고 진단과 자동 수정 결과가 유지됩니다. 의도된 namespace 변경의 override 이전 방법을 문서화합니다. ESLint 8은 실제 필요와 검증 근거가 있을 때 별도 지원합니다.

## 후속 2: Oxlint / typed lint

modern에서 지원 규칙을 하나씩 이관합니다. 진단·옵션·자동 수정의 동등성을 검증한 규칙만 ESLint에서 끕니다. Oxlint 설정과 실행 명령은 따로 제공합니다.

typed lint는 프로젝트 요구와 type 정보 처리 비용을 확인해 담당 도구를 정합니다. Oxlint에도 type-aware 기능이 있으므로 ESLint 전용으로 가정하지 않습니다.

완료 기준: 누락·중복 진단이 없고 legacy에 Oxlint 설치를 요구하지 않습니다.

## 후속 3: Vue / Nuxt

실제 사용하는 프로젝트가 생기면 parser, SFC script/template, Nuxt 자동 import와 전역을 검증합니다. 기존 React/Next 소비자에 불필요한 의존성이 추가되지 않아야 합니다.

## 패키지 구조

하나의 레포에서 npm workspace로 여러 패키지를 관리합니다. 루트는 `private: true`로 두고 배포하지 않습니다. 아래 구조는 구현 계획입니다.

```text
package.json                 # private, workspaces: ["packages/*"]
packages/
  lint/
    package.json             # @hoseop/lint
    src/
  lint-legacy/
    package.json             # @hoseop/lint-legacy
    src/
```

먼저 modern 패키지만 구현하고 legacy 폴더는 해당 작업 시 추가합니다. 공통 코드는 실제 필요가 확인될 때 공유합니다. 배포 코드가 패키지 밖의 파일을 상대 경로로 import하면 설치 후 누락되므로, 공유 코드는 각 배포물에 포함하거나 별도 의존성으로 제공해야 합니다.

## 버전과 작업 단위

- 첫 배포: `@hoseop/lint@0.1.0`, legacy는 준비되면 `@hoseop/lint-legacy@0.1.0`으로 시작하는 안
- 각 패키지의 버전은 독립적으로 올립니다. 같은 번호를 사용할 수 있지만 동기화는 필수가 아닙니다.
- Git 태그는 `lint-v0.1.0`, `lint-legacy-v0.1.0`처럼 패키지를 구분합니다.
- 후속 배포: 변경된 패키지만 검증하고 배포합니다.
- 버전과 CHANGELOG: 새 규칙·severity·자동 수정 변경이 소비 코드에 미치는 영향을 명시하고, 호환성을 깨는 변경을 조용히 섞지 않음
- 브랜치: `docs/project-plan`, `feat/modern-presets`, `feat/legacy-presets`, `feat/oxlint-config`
- 커밋: `docs: 개인 패키지 배포 계획 정리`처럼 변경 결과를 표현

세부 비교는 [호환성 분석](compatibility.md)을 참고합니다. 장기 목표 전체의 완료가 첫 배포 조건은 아닙니다.
