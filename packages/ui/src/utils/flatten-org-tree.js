export function flattenOrgTree(tree) {
    const result = [];

    function traverse(node, parentId) {
        result.push({
            id: node.id,
            parentId: parentId,
            name: node.label,
            type: node.type,
            originalData: node.data,
        });

        if (node.children && node.children.length) {
            node.children.forEach((child) => traverse(child, node.id));
        }
    }

    traverse(tree, null);
    return result;
}