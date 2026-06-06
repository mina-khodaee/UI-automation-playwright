export function buildOrgChartData(sites, units, personnels, selectedSiteId = null, selectedUnitId = null) {
    if (!sites?.length) return null;

    let filteredSites = sites;
    if (selectedSiteId) {
        const selectedSite = sites.find(s => s.id === selectedSiteId);
        if (selectedSite) {
            const getAllChildSites = (parentId) => sites.filter(s => s.parentSiteId === parentId);
            const collectSiteAndChildren = (site) => {
                let result = [site];
                const children = getAllChildSites(site.id);
                children.forEach(child => {
                    result = result.concat(collectSiteAndChildren(child));
                });
                return result;
            };
            filteredSites = collectSiteAndChildren(selectedSite);
        } else {
            filteredSites = [];
        }
    }

    const siteMap = new Map();
    filteredSites.forEach(site => {
        siteMap.set(site.id, {
            id: site.id,
            label: site.name,
            type: 'site',
            children: [],
            data: site,
        });
    });

    const rootSites = [];
    filteredSites.forEach(site => {
        const node = siteMap.get(site.id);
        if (site.parentSiteId && siteMap.has(site.parentSiteId)) {
            siteMap.get(site.parentSiteId).children.push(node);
        } else {
            rootSites.push(node);
        }
    });

    let filteredUnits = units;
    if (selectedUnitId) {
        const selectedUnit = units.find(u => u.id === selectedUnitId);
        if (selectedUnit) {
            filteredUnits = [selectedUnit];
        } else {
            filteredUnits = [];
        }
    }

    filteredUnits.forEach(unit => {
        if (unit.site?.id && siteMap.has(unit.site.id)) {
            const unitNode = {
                id: unit.id,
                label: unit.name,
                type: 'unit',
                children: [],
                data: unit,
            };
            siteMap.get(unit.site.id).children.push(unitNode);
        }
    });

    personnels.forEach(person => {
        const personNode = {
            id: person.id,
            label: `${person.firstName} ${person.lastName}`,
            type: 'person',
            children: [],
            data: {
                ...person,
                fullName: `${person.firstName} ${person.lastName}`,
                positionName: person.position?.name,
                personnelCode: person.personnelCode,
            },
        };
        const findUnitAndAdd = (nodes) => {
            for (const node of nodes) {
                if (node.type === 'unit' && node.id === person.unit?.id) {
                    node.children.push(personNode);
                    return true;
                }
                if (node.children?.length && findUnitAndAdd(node.children)) return true;
            }
            return false;
        };
        findUnitAndAdd(rootSites);
    });

    if (rootSites.length === 1) {
        return rootSites[0];
    } else if (rootSites.length > 1) {
        return {
            id: 'root',
            label: 'سازمان',
            type: 'root',
            children: rootSites,
        };
    }
    return null;
}