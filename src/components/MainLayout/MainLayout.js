import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import NavBarContainer from "src/containers/NavBarContainer";
import BreadcrumbContainer from "src/containers/BreadcrumbContainer";
import SideBarContainer from "src/containers/SideBarContainer";
import styles from "./MainLayout.module.scss";

const cx = cn.bind(styles);

const MainLayout = ({ children }) => {
    return (
        <div className={cx("main-layout")}>
            <NavBarContainer />
            <div className={cx("main-layout-main")}>
                <SideBarContainer />
                <div className={cx("content")}>
                    <BreadcrumbContainer />
                    {children}
                </div>
            </div>

        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.any,
};
MainLayout.defaultProps = {
};

export default MainLayout;
