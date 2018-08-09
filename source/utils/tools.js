export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// Style utils
/* To make a line overflow with an ellipsis (…) */
export function truncate(width) {
    return `
    width: ${width};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
}
// usage
// const Box = styled.div`
//   ${ truncate('250px') }
//   background: papayawhip;
// `;
