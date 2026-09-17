# 다른 컴퓨터에서 작업 이어가기

## 현재 상태

현재 저장소에는 README, 설계·호환성 문서, 두 버전의 참고 코드와 테스트가 있습니다. 실제 배포용 패키지, workspace 설정, lockfile, 루트 CI는 아직 없습니다. npm 배포와 의존성 설치·lint 실행 검증도 하지 않았습니다.

`reference/v1.1.1`과 `reference/v2.0.1`은 과거 설정의 참고 기준입니다. 새 패키지의 버전 관리용 디렉터리가 아니며, 직접 배포하지 않습니다. 개인 명칭으로 정리한 파일이므로 원본과 완전히 동일한 스냅샷도 아닙니다. 필요한 구현과 회귀 테스트를 옮기고 검증한 뒤 참고 폴더는 제거할 수 있습니다.

회사명이 들어간 패키지명과 오래된 추가 참고 버전은 다시 가져오지 않습니다. 라이선스의 개인 저작권 고지는 유지합니다.

## 다른 컴퓨터에서 시작

```sh
git clone https://github.com/HoSeopLee/lint.git
cd lint
git switch main
git pull --ff-only
git switch -c feat/modern-presets
```

위 브랜치 생성은 새 작업을 시작할 때 사용합니다. 이미 다른 컴퓨터에서 해당 브랜치를 만들어 푸시했다면 `git fetch origin` 후 기존 브랜치로 전환합니다.

문서는 이 파일 → [작업 계획](roadmap.md) → [호환성 분석](compatibility.md) → [참고 자료](../reference/README.md) 순서로 읽습니다. 참고 코드가 저장소에 포함되어 있어 이전 컴퓨터의 로컬 폴더나 과거 프로젝트 checkout은 필요하지 않습니다.

현재는 루트 package.json이 없으므로 clone 직후 루트에서 npm install/test/publish를 실행하는 단계가 아닙니다.

## 합의한 관리 방향

한 GitHub 저장소에서 관련 패키지를 관리하는 모노레포 방식으로 진행합니다. npm workspace를 기본 도구로 검토하며, 두 패키지 규모에서 별도 대형 관리 도구를 먼저 도입하지 않습니다.

```text
lint/
├─ package.json                 # private: true, workspaces: ["packages/*"]
└─ packages/
   ├─ lint/
   │  ├─ package.json           # name: @hoseop/lint
   │  └─ src/                   # modern 설정
   └─ lint-legacy/
      ├─ package.json           # name: @hoseop/lint-legacy
      └─ src/                   # legacy 설정
```

이것은 목표 구조이며 아직 구현하지 않았습니다. legacy 패키지는 후속 작업 때 생성합니다. 루트는 관리용으로만 쓰고 npm에 배포하지 않습니다.

- 함께 관리: Git 저장소, 작업 검토, 공통 정책과 개발 문서
- 따로 관리: 패키지명, dependencies/peerDependencies, Node 요구 조건, exports, 버전과 배포
- workspace 설치와 독립 설치는 다름: 각 패키지를 pack한 결과를 격리된 소비 프로젝트에 설치해 검증
- 공통 코드: 패키지 바깥 파일의 상대 import에 기대지 않고 배포물 포함 여부를 확인

npm은 workspace를 지정하거나 해당 패키지 디렉터리에서 실행해 개별 배포할 수 있습니다. 실제 배포는 이름·권한·테스트·tarball 검증이 끝난 뒤 진행합니다. [npm workspaces 공식 문서](https://docs.npmjs.com/cli/v11/using-npm/workspaces/) 참고.

## 버전 관리

| 패키지 | 설정 기반 | 첫 버전 제안 | Git 태그 예시 |
| --- | --- | --- | --- |
| `@hoseop/lint` | 참고 2.0.1 | `0.1.0` | `lint-v0.1.0` |
| `@hoseop/lint-legacy` | 참고 1.1.1 | `0.1.0` | `lint-legacy-v0.1.0` |

참고 버전 번호를 새 패키지 버전으로 이어받지 않습니다. 각 package.json에서 버전을 관리하고 해당 릴리스의 코드는 Git 태그로 고정합니다. 변경 사항은 패키지별 CHANGELOG에 작성합니다. 릴리스마다 소스를 버전 폴더로 복사하지 않습니다.

두 패키지가 같은 버전 번호를 가져도 충돌하지 않습니다. 다만 독립 버전 관리를 기본으로 하여 modern만 수정되면 modern만 올리고 배포합니다. 공통 코드 변경이 양쪽 배포물에 영향을 주면 둘 다 검증하고 필요한 버전을 올립니다.

## 바로 다음 작업

1. 사용할 Node·npm 버전을 정하고 `@hoseop` scope 권한과 패키지명 사용 가능 여부를 확인합니다. 권한·사용 가능 여부는 아직 확인하지 않았습니다.
2. 루트 private workspace와 `packages/lint`를 생성합니다. 패키지 이름은 modern `@hoseop/lint`, legacy `@hoseop/lint-legacy` 방향입니다.
3. `reference/v2.0.1`에서 React/Next 설정과 필요한 회귀 테스트를 옮깁니다. 대규모 규칙 강화와 Oxlint 이관은 섞지 않습니다.
4. `/react`, `/next` 공개 경로를 검증하고 의존성·exports·engines를 실제 결과에 맞춰 선언합니다. 설치 예시는 아직 동작이 보장되는 API가 아닙니다.
5. ESLint 10 / TS 6.0.x 기준에서 peer·Node engine과 최소/상한 조합을 확인합니다. 기존 선언 범위는 지원 보장이 아닙니다.
6. React 단독 / Next 소비자에서 진단·자동 수정·TS no-undef 예외를 테스트합니다. pack 결과를 별도 프로젝트에 설치해 검증합니다.
7. README와 CHANGELOG를 실제 기능에 맞게 갱신한 뒤 첫 배포를 진행합니다.

이후 legacy(1.1.1 기준) → Oxlint/추가 typed lint → Vue/Nuxt 순으로 확장합니다. ESLint 8은 별도 검증이 필요한 후속 목표입니다. 장기 목표 전체의 완료를 첫 npm 배포 조건으로 삼지 않습니다.

## 작업 규칙

브랜치는 `feat/modern-presets`처럼 작업 목적을 표현합니다. 커밋은 실제 변경 내용을 간결하게 적습니다. 준비 문서·정책 변경·기능 구현은 검토 가능한 단위로 구분합니다. 인증 정보와 개인 컴퓨터 경로를 저장소에 넣지 않습니다.
