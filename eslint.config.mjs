import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules - incrementally enabling for better type safety
    "@typescript-eslint/no-explicit-any": "warn", // Warn but don't break build
    "@typescript-eslint/no-unused-vars": "warn", // Catch unused variables
    "@typescript-eslint/no-non-null-assertion": "off", // Keep off for now (common in React)
    "@typescript-eslint/ban-ts-comment": "warn", // Warn about @ts-ignore comments
    "@typescript-eslint/prefer-as-const": "off", // Not critical
    
    // React rules - enabling critical correctness rules
    "react-hooks/exhaustive-deps": "warn", // Important for hook correctness
    "react-hooks/purity": "off", // Keep off for now (experimental)
    "react-hooks/refs": "off", // Keep off for now
    "react/no-unescaped-entities": "off", // Not critical for portfolio
    "react/display-name": "warn", // Helpful for debugging components
    "react/prop-types": "off", // Not needed with TypeScript
    "react-compiler/react-compiler": "off", // Experimental feature
    
    // Next.js rules
    "@next/next/no-img-element": "warn", // Prefer next/image for optimization
    "@next/next/no-html-link-for-pages": "warn", // Catch incorrect navigation
    
    // General JavaScript rules - balanced approach
    "prefer-const": "warn", // Encourage const when possible
    "no-unused-vars": "off", // Let TypeScript handle this
    "no-console": "warn", // Warn about console logs (use debugging instead)
    "no-debugger": "warn", // Catch forgotten debugger statements
    "no-empty": "warn", // Catch empty blocks
    "no-irregular-whitespace": "warn", // Catch spacing issues
    "no-case-declarations": "off", // Keep off (common pattern)
    "no-fallthrough": "off", // Keep off (common pattern in switch statements)
    "no-mixed-spaces-and-tabs": "error", // Always error on mixed indentation
    "no-redeclare": "off", // Let TypeScript handle this
    "no-undef": "off", // Let TypeScript handle this
    "no-unreachable": "warn", // Catch unreachable code
    "no-useless-escape": "warn", // Catch unnecessary escapes
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills", "public/**"]
}];

export default eslintConfig;
