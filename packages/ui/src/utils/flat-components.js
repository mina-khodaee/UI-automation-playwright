import { componentPaths } from "../auth/guard/component-paths";

const flattenComponents = () => {
    const result = [];

    const traverse = (node) => {
        if (node.componentId && node.componentDescription) {
            result.push({ componentId: node.componentId, componentDescription: node.componentDescription });
        } else if (typeof node === "object") {
            Object.values(node).forEach(traverse);
        }
    };

    traverse(componentPaths);
    return result;
};

export default flattenComponents;