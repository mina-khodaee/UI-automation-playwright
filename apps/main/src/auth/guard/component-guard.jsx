'use client';

import React, { useMemo } from "react";

import { useAuthContext } from "../hooks";

export const ComponentGuard = ({ children }) => {
    const { siteClaims, uiComponents } = useAuthContext();

    // --- Collect user claims ---
    const userClaims = siteClaims.flatMap((site) => [
        ...(site.roleClaims.flatMap((role) =>
            role.claims.flatMap((claim) =>
                claim.values.map((value) => ({ type: claim.name.toLowerCase(), value: value.toLowerCase() }))
            )
        )),
        ...(site.positionClaims.flatMap((pos) =>
            pos.claims.flatMap((claim) =>
                claim.values.map((value) => ({ type: claim.name.toLowerCase(), value: value.toLowerCase() }))
            )
        )),
        ...(site.userClaims.flatMap((claim) =>
            claim.values.map((value) => ({ type: claim.name.toLowerCase(), value: value.toLowerCase() }))
        )),
    ]);

    const hasRequiredClaims = (component) => {
        if (!component.claims || component.claims.length === 0) return true;

        // Require ALL component claims to exist in user claims
        return component.claims.every((reqClaim) =>
            userClaims.some(
                (userClaim) =>
                    userClaim.type === reqClaim.type.toLowerCase() &&
                    userClaim.value === reqClaim.value.toLowerCase()
            )
        );
    };

    // --- Recursively traverse and filter children ---
    const filterChildren = (element) => {
        if (!React.isValidElement(element)) return element;

        const { componentId } = element.props;

        if (componentId) {
            const component = uiComponents.find((c) => c.componentId === componentId);
            if (!component) return null; // hide unknown components
            if (!hasRequiredClaims(component)) return null; // hide unauthorized
        }

        const newProps = {};

        // Check all props for nested elements
        for (const key in element.props) {
            const prop = element.props[key];
            if (React.isValidElement(prop)) {
                newProps[key] = filterChildren(prop);
            } else if (Array.isArray(prop)) {
                newProps[key] = prop.map((item) => (React.isValidElement(item) ? filterChildren(item) : item));
            }
        }

        // Traverse children separately
        if (element.props.children) {
            newProps.children = React.Children.map(element.props.children, filterChildren);
        }

        return React.cloneElement(element, newProps);
    };

    const filteredChildren = useMemo(
        () => React.Children.map(children, filterChildren),
        [children, uiComponents, userClaims]
    );

    return <>{filteredChildren}</>;
};
