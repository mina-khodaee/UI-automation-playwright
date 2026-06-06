// ----------------------------------------------------------------------

const flattenNavItems = (navItems, parentGroup) => {
  let flattenedItems = [];

  navItems.forEach((navItem) => {
    const currentGroup = parentGroup
      ? `${parentGroup}-${navItem.title}`
      : navItem.title;
    const groupArray = currentGroup.split('-');

    flattenedItems.push({
      title: navItem.title,
      path: navItem.path,
      group: groupArray.length > 2
        ? `${groupArray[0]}.${groupArray[1]}`
        : groupArray[0],
    });

    const nestedItems = navItem.children ?? navItem.items;

    if (nestedItems) {
      flattenedItems = flattenedItems.concat(
        flattenNavItems(nestedItems, currentGroup)
      );
    }
  });
  return flattenedItems;
};

export function flattenNavSections(navSections) {
  return navSections.flatMap((navSection) => {

    const sectionTitle = navSection.subheader ?? navSection.title;
    const sectionItems = navSection.items ?? navSection.children;

    return flattenNavItems(sectionItems, sectionTitle);
  });
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, query }) {
  if (!query) return inputData;

  return inputData.filter(({ title, path, group }) =>
    [title, path, group].some((field) =>
      field?.toLowerCase().includes(query.toLowerCase())
    )
  );
}