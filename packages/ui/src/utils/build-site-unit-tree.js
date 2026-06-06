export function buildSiteUnitTree(sites, units) {
    if (!sites?.length) return [];

    const siteMap = new Map();
    const rootSites = [];

    sites.forEach(site => {
        const siteNode = {
            id: site.id,
            label: site.name,
            type: 'site',
            children: [],
            ...site,
        };
        siteMap.set(site.id, siteNode);
    });

    sites.forEach(site => {
        const siteNode = siteMap.get(site.id);
        if (site.parentSiteId && siteMap.has(site.parentSiteId)) {
            siteMap.get(site.parentSiteId).children.push(siteNode);
        } else {
            rootSites.push(siteNode);
        }
    });

    if (units?.length) {
        units.forEach(unit => {
            const unitNode = {
                id: unit.id,
                label: unit.name,
                type: 'unit',
                parentSiteId: unit.site?.id,
                floorNumber: unit.floorNumber,
                callExtension: unit.callExtension,
                description: unit.description,
                children: [],
                ...unit,
            };

            if (unit.site?.id && siteMap.has(unit.site.id)) {
                siteMap.get(unit.site.id).children.push(unitNode);
            }
        });
    }

    const sortChildren = (nodes) => {
        nodes.sort((a, b) => a.label.localeCompare(b.label));
        nodes.forEach(node => {
            if (node.children?.length) {
                sortChildren(node.children);
            }
        });
    };

    sortChildren(rootSites);

    return rootSites;
}