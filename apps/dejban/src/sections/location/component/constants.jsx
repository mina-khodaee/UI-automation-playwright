export const LOCATION_TYPES = {
  COUNTRY: 'country',
  PROVINCE: 'province',
  CITY: 'city'
};

export const DIALOG_MODES = {
  ADD_COUNTRY: 'addCountry',
  ADD_PROVINCE: 'addProvince',
  ADD_CITY: 'addCity',
  EDIT: 'edit'
};

// Build Tree
export const buildTree = (data, selectedId = null) => {
  if (!data || data.length === 0) return [];

  const tree = [];
  const countries = data.filter(item => !item.parentId || item.parentId === 0 || item.parentId === "0");

  countries.forEach(country => {
    const countryNode = {
      id: country.id,
      label: country.name,
      type: LOCATION_TYPES.COUNTRY,
      data: country,
      isSelected: selectedId === country.id,
      children: [],
    };

    if (country.provinces && country.provinces.length > 0) {
      country.provinces.forEach(province => {
        const provinceNode = {
          id: province.id,
          label: province.name,
          type: LOCATION_TYPES.PROVINCE,
          data: province,
          isSelected: selectedId === province.id,
          children: [],
        };

        if (province.cities && province.cities.length > 0) {
          province.cities.forEach(city => {
            const cityNode = {
              id: city.id,
              label: city.name,
              type: LOCATION_TYPES.CITY,
              data: city,
              isSelected: selectedId === city.id,
              children: [],
            };
            provinceNode.children.push(cityNode);
          });
        }

        countryNode.children.push(provinceNode);
      });
    }

    tree.push(countryNode);
  });

  return tree;
};

// Button
export const getAddButtonLabel = (type) => {
  switch (type) {
    case LOCATION_TYPES.COUNTRY:
      return 'افزودن استان';
    case LOCATION_TYPES.PROVINCE:
      return 'افزودن شهر';
    case LOCATION_TYPES.CITY:
      return 'افزودن';
    default:
      return 'افزودن';
  }
};