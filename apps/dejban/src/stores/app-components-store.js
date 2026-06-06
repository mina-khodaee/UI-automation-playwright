import { create } from "zustand";

import flattenComponents from '@repo/ui/utils'

// ----------------------------------------------------------------------

const components = flattenComponents();

export const useAppComponents = create((set) => ({
    components: components,

    // TODO: add async setter to call api for adding claims to component
    // TODO: add async setter to synchronize app components with components saved in backend (remove any component from backend that does not exist in front end anymore)
}));
