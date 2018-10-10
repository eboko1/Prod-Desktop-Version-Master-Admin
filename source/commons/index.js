import { LayoutComponent as Layout } from './Layout';
import Header from './Header';
import Footer from './Footer';
import ModuleHeader from './ModuleHeader';
import Navigation from './Navigation';
import Spinner from './Spinner';
import Catcher from './Catcher';
import Numeral from './Numeral';
import {
    MobileView,
    TabletView,
    DesktopView,
    ResponsiveView,
} from './ResponsiveViews';
import Loader from './Loader';

// utils entry point

// re-exports (*) must be before ES6 other (default) exports
// webpack issue: https://github.com/webpack/webpack/issues/3509
export * from './_uikit';

export {
    Header,
    ModuleHeader,
    Footer,
    Layout,
    Navigation,
    Spinner,
    Catcher,
    Numeral,
    MobileView,
    TabletView,
    DesktopView,
    ResponsiveView,
    Loader,
};
