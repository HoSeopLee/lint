# 1차 목표: 두 계열 배포와 유지보수 환경

하나의 npm 패키지 `@hoseop/lint`를 1.x와 2.x로 분리해 배포하고, 각 브랜치에서 설치·수정·테스트·후속 배포를 이어갈 수 있게 합니다.

| 계열 | 유지 브랜치 | 초기 버전 | 참고 코드 | npm 태그 |
| --- | --- | --- | --- | --- |
| Legacy | 1.x | 1.0.0 | reference/v1.1.1 | legacy |
| Modern | main | 2.0.0 | reference/v2.0.1 | latest |

기존의 두 패키지 workspace 및 0.1.0 배포 제안은 이 방식으로 대체합니다. 두 계열 모두 1차 목표에 포함합니다.

## 작업 순서

1. 각 브랜치 루트에 기존 설정·공개 경로·회귀 테스트를 이전합니다.
2. 각 계열의 의존성, Node engine, lockfile과 npm 배포 파일을 검증합니다.
3. React 단독 소비자와 Next 소비자에 실제 tarball을 설치해 lint·자동 수정을 확인합니다.
4. CI, README, CHANGELOG와 [개발 안내](development.md)를 정리합니다.
5. [검증 기록](release-checklist.md)에 브랜치·버전·태그·통과 항목을 제시하고 사용자 승인을 받습니다.
6. 승인된 두 버전을 배포하고 npm 설치 및 dist-tag를 확인합니다.

## 완료 기준

- 각 계열이 --force / --legacy-peer-deps 없이 설치됩니다.
- public entry point와 규칙 검사가 동작하고, import 자동 수정 결과가 정확합니다.
- React 단독 설치에 Next plugin이 필요하지 않습니다.
- 최소 Node 및 개발 Node에서 검증합니다.
- 배포물에 reference·테스트·내부 문서가 포함되지 않습니다.
- 저장소의 브랜치와 package.json 버전, Git 태그, npm 태그가 일치합니다.
- 사용자가 분리 결과를 검토하고 승인한 뒤 배포합니다.

## 후속 작업

첫 배포 후 필요한 규칙 변경, Oxlint/추가 typed lint, Vue/Nuxt를 각각 별도 작업으로 검토합니다. ESLint 8, 새 확장자, 전체 규칙 재설계는 실제 요구와 검증을 갖춘 뒤 지원합니다.
