// vendor
import { replace, push, goBack } from 'connected-react-router';
import store from 'store/store';

// own
const { dispatch } = store;

// tools
export const numeralFormatter = value =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const numeralParser = value =>
    `${value}`.replace(/\$\s?|(\s)/g, '').replace(/,/g, '.');

// Components utils
export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// Routing utils
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
