// vendor
import { replace, push, goBack } from 'react-router-redux';
import store from 'store/store';

// own
const { dispatch } = store;

export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export const linkBack = () => dispatch(goBack());

export const goTo = (pathname, state) => dispatch(push(pathname, state));

export const linkTo = link => dispatch(replace(link));

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
