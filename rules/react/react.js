import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const getStaticAttributeValue = (attribute) => {
  const value = attribute.value;
  if (!value) return true;
  if (value.type === "Literal") return value.value;
  if (value.type !== "JSXExpressionContainer") return undefined;

  const expression = value.expression;
  if (expression.type === "Literal") return expression.value;
  if (expression.type === "TemplateLiteral" && expression.expressions.length === 0)
    return expression.quasis[0]?.value.cooked;

  return undefined;
};

const legacyReactRules = {
  rules: {
    "no-unsafe-target-blank": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          missingNoopener: 'target="_blank" links require rel="noopener".',
        },
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            if (node.name.type !== "JSXIdentifier" || node.name.name !== "a")
              return;

            const attributes = Object.fromEntries(
              node.attributes
                .filter(
                  (attribute) =>
                    attribute.type === "JSXAttribute" &&
                    attribute.name.type === "JSXIdentifier",
                )
                .map((attribute) => [
                  attribute.name.name,
                  getStaticAttributeValue(attribute),
                ]),
            );
            if (
              attributes.target !== "_blank" ||
              !/^(?:\w+:|\/\/)/.test(attributes.href)
            )
              return;
            if (
              typeof attributes.rel === "string" &&
              attributes.rel.split(/\s+/).includes("noopener")
            )
              return;

            context.report({ node, messageId: "missingNoopener" });
          },
        };
      },
    },
  },
};

/**
 * rules/react/react.js — React + Hooks + Refresh (configs/react.js 대응)
 * 라인별: 규칙 설명 + (warn/error/off)
 */
export default {
  plugins: {
    ...eslintReact.configs["recommended-typescript"].plugins,
    "broccoil-react": legacyReactRules,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  rules: {
    // only-export-components는 preset에서 테스트 등 override (off)
    "react-refresh/only-export-components": "off",
    // 선언 또는 import되지 않은 JSX 컴포넌트와 식별자 사용 금지 (error)
    "no-undef": "error",
    // 반복 렌더링 요소의 key 누락 금지 (error)
    "@eslint-react/no-missing-key": "error",
    // 배열 인덱스를 key로 쓰면 경고 (warn)
    "@eslint-react/no-array-index-key": "warn",
    // children을 일반 prop으로 직접 전달하는 패턴 금지 (error)
    "@eslint-react/jsx-no-children-prop": "error",
    // children과 dangerouslySetInnerHTML 동시 사용 금지 (error)
    "@eslint-react/dom-no-dangerously-set-innerhtml-with-children": "error",
    // React에서 폐기되었거나 권장되지 않는 레거시 API 사용 경고 (warn)
    ...Object.fromEntries(
      [
        "@eslint-react/no-component-will-mount",
        "@eslint-react/no-component-will-receive-props",
        "@eslint-react/no-component-will-update",
        "@eslint-react/no-create-ref",
        "@eslint-react/no-forward-ref",
        "@eslint-react/dom-no-find-dom-node",
        "@eslint-react/dom-no-hydrate",
        "@eslint-react/dom-no-render",
        "@eslint-react/dom-no-render-return-value",
      ].map((rule) => [rule, "warn"]),
    ),
    // this.state 직접 변경 금지 (error)
    "@eslint-react/no-direct-mutation-state": "error",
    // 제거된 ReactDOM.findDOMNode API 사용 경고 (warn)
    "@eslint-react/dom-no-find-dom-node": "warn",
    // ReactDOM.render 반환값 사용 금지 (error)
    "@eslint-react/dom-no-render-return-value": "error",
    // 불필요한 Fragment 사용 경고 (warn)
    "@eslint-react/jsx-no-useless-fragment": "warn",
    // javascript: URL 사용 경고 (warn)
    "@eslint-react/dom-no-script-url": "warn",
    // 외부 _blank 링크에 rel="noopener" 누락 시 경고 (warn)
    "broccoil-react/no-unsafe-target-blank": "warn",
    // 클래스 컴포넌트의 사용되지 않는 state 경고 (warn)
    "@eslint-react/no-unused-state": "warn",
    // Hooks 규칙 (error)
    "react-hooks/rules-of-hooks": "error",
    // exhaustive-deps (off) - false positive가 많고(특히 stable 값/커스텀 훅) 팀에 노이즈, 코드리뷰·useCallback 패턴으로 대체 (v1.0.7)
    "react-hooks/exhaustive-deps": "off",
    // 렌더링 누출 방지 (off) - 팀 코드리뷰·TS 타입으로 대체
    "@eslint-react/no-leaked-conditional-rendering": "off",
    // context 값 변경 금지 (warn)
    "@eslint-react/no-unstable-context-value": "warn",
  },
};
