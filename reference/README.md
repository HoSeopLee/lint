# 버전별 참고 자료

개인 lint 패키지의 정책과 구현을 비교하기 위한 자료입니다. 아래 버전은 이전 설정의 기준이며 새 패키지의 릴리스 번호가 아닙니다.

| 기준 | 역할 |
| --- | --- |
| `v1.1.1` | ESLint 9 / TypeScript 5 계열의 legacy 참고 자료 |
| `v2.0.1` | ESLint 10 / TypeScript 6.0 계열의 modern 참고 자료 |

## 보존과 변경 범위

각 기준의 공개 진입점, presets, rules, 테스트와 fixture, tsconfig, CI 정의, 라이선스를 보관합니다. 개인 패키지에 맞게 패키지명·저장소 URL·설명과 로컬 React plugin namespace를 정리했습니다. fixture의 기대 rule ID도 같은 namespace로 변경했습니다.

따라서 이 자료는 원본과 바이트 단위로 동일한 스냅샷이 아닙니다. lint 정책과 의존성 범위는 참고를 위해 유지했으며, 공개 API를 확정한 것도 아닙니다. 각 package.json에는 `private: true`를 지정해 참고 자료의 별도 배포를 막습니다. 라이선스의 저작권 고지는 보존합니다.

이 디렉터리는 workspace나 새 패키지의 런타임 코드가 아닙니다. `.github/workflows/ci.yml`도 참고용이며 루트 CI로 실행되지 않습니다. npm 배포 대상에서 제외합니다.

## 검증 범위

브랜드명 정리 이외의 규칙·옵션 변경 여부, plugin namespace와 fixture 일치, 파일 경로와 JSON을 확인합니다. 의존성 설치와 기존 lint 테스트 실행은 아직 수행하지 않았습니다. 실제 지원은 새 구현과 설치 테스트를 통과한 뒤 선언합니다.

동작 차이와 이전 계획은 [호환성 분석](../docs/compatibility.md), 배포 순서는 [작업 계획](../docs/roadmap.md)을 참고합니다.
