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
    "@eslint-react/no-missing-key": "error",
    "@eslint-react/jsx-no-duplicate-props": "error",
    "@eslint-react/jsx-no-undef": "error",
    // 배열 인덱스를 key로 쓰면 경고 (warn)
    "@eslint-react/no-array-index-key": "warn",
    "@eslint-react/no-children-prop": "error",
    "@eslint-react/dom/no-dangerously-set-innerhtml-with-children": "error",
    ...Object.fromEntries(
      Object.keys(eslintReact.configs["no-deprecated"].rules).map((rule) => [
        rule,
        "warn",
      ]),
    ),
    "@eslint-react/no-direct-mutation-state": "error",
    "@eslint-react/dom/no-find-dom-node": "warn",
    "@eslint-react/dom/no-render-return-value": "error",
    "@eslint-react/no-string-refs": "error",
    "@eslint-react/jsx-shorthand-boolean": "warn",
    "@eslint-react/jsx-shorthand-fragment": "warn",
    "@eslint-react/no-useless-fragment": "warn",
    "@eslint-react/dom/no-script-url": "warn",
    "broccoil-react/no-unsafe-target-blank": "warn",
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
