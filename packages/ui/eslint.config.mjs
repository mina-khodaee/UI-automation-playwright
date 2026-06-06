import { config } from "@repo/eslint-config/react-internal";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export default [
    ...config,
    {
        languageOptions: {
            globals: {
                process: "readonly"
            }
        }
    }
]
